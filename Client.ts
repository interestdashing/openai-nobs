import https from "https";

export interface IResponseData {}

export interface IFormField {
    name: string;
    value: string;
}
export interface IFormFile {
    name: string;
    filename: string;
    mime: string;
    buf: Buffer;
}
export type IFormEntry = IFormFile | IFormField;

export abstract class ClientHandler<T extends IResponseData> {
    public abstract getResourceUri(): string;
    public abstract parseResult(data: Buffer): Promise<T>;

    public getPostData(): Buffer | undefined {
        return undefined;
    }
    public getFormData(): Array<IFormEntry> | undefined {
        return undefined;
    }
    public getAdditionalHeaders(): { [key: string]: string } | undefined {
        return undefined;
    }
}

export interface IClientOptions {
    apiKey: string;
    organization?: string;
}

export class Client {
    private _apiKey: string;
    private _organization?: string;
    private _formBoundaryIndex = 0;

    constructor(options: IClientOptions) {
        this._apiKey = options.apiKey;
        this._organization = options.organization;
    }

    public makeRequest<T extends IResponseData>(handler: ClientHandler<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            try {
                const resourceUri = new URL(handler.getResourceUri());
                const postData = handler.getPostData === undefined ? undefined : handler.getPostData();
                const formData = handler.getFormData === undefined ? undefined : handler.getFormData();

                if (postData !== undefined && formData !== undefined) {
                    throw { error: "Unexpected mixed form/post data. Use either getPostData or getFormData but not both." };
                }
                
                const headers: { [key: string]: string } = {
                    "Authorization": `Bearer ${this._apiKey}`,
                    "Accept": `*/*`,
                };
                if (this._organization !== undefined) {
                    headers["OpenAI-Organization"] = this._organization;
                }
                let dataToSend: Buffer | undefined;
                if (postData !== undefined) {
                    dataToSend = postData;
                    headers["Content-Type"] = "application/json";
                    headers["Content-Length"] = dataToSend.length.toString();
                }
                if (formData !== undefined) {
                    const border = `------boundary${this._formBoundaryIndex++}`;
                    dataToSend = this._getFormData(formData, border);
                    headers["Content-Type"] = `multipart/form-data; boundary=${border}`;
                    headers["Content-Length"] = dataToSend.length.toString();
                }
                if (handler.getAdditionalHeaders !== undefined) {
                    const addl = handler.getAdditionalHeaders();
                    if (addl !== undefined) {
                        for (const key of Object.keys(addl)) {
                            headers[key] = addl[key];
                        }
                    }
                }
                const req = https.request(resourceUri, {
                    headers,
                    method: postData === undefined && formData === undefined ? "GET" : "POST",
                }, (res) => {
                    let str = '';
                    res.on("data", (d) => {
                        str += d;
                    });

                    res.on("end", async () => {
                        try {
                            const result = await handler.parseResult(Buffer.from(str, 'utf8'));
                            resolve(result);
                        } catch (e: unknown) {
                            reject(e);
                        }
                    });

                    res.on("error", (err) => {
                        reject(err);
                    });
                });

                req.on("error", (err) => {
                    reject(err);
                });

                if (dataToSend !== undefined) {
                    req.write(dataToSend);
                }

                req.end();
            } catch (e) {
                reject(e);
            }
        });
    }

    private _getFormData(formData: Array<IFormEntry>, boundary: string): Buffer {
        let buffer = Buffer.from(``);
        for (const d of formData) {
            const field = d as IFormField;
            const data = d as IFormFile;
            if (data.buf !== undefined) {
                buffer = Buffer.concat([
                    buffer,
                    Buffer.from(
                        `--${boundary}\r\n`+
                        `Content-Disposition: form-data; name="${data.name}"; filename="${data.filename}"\r\n` +
                        `Content-Type: ${data.mime}\r\n\r\n`
                    ),
                    data.buf,
                    Buffer.from(`\r\n`)
                ]);
            } else if (field.value !== undefined) {
                buffer = Buffer.concat([
                    buffer,
                    Buffer.from(
                        `--${boundary}\r\n`+
                        `Content-Disposition: form-data; name="${field.name}"\r\n\r\n` +
                        `${field.value}\r\n`
                    )
                ]);
            } 
        }

        return Buffer.concat([
            buffer,
            Buffer.from(`--${boundary}--`)
        ]);
    }
}

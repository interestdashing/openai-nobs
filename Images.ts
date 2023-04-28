import { ClientHandler, IFormEntry, IResponseData } from "./Client";

export type ImageSize = "256x256" | "512x512" | "1024x1024";

export interface IImageData extends IResponseData {
    created: number;
    data: Array<Buffer>;
}

export interface IImageBaseRequest {
    size?: ImageSize;
    user?: string;
    n?: number; // default 1
}

export interface IImageGenerateRequest extends IImageBaseRequest {
    prompt: string;
}

export interface IImageVariationRequest extends IImageBaseRequest {
    image: Buffer,
    image_filename?: string;
}

export interface IImageEditRequest extends IImageVariationRequest {
    prompt: string;
    mask?: Buffer;
    mask_filename?: string;
}

export abstract class BaseImageHandler extends ClientHandler<IImageData> {
    public override async parseResult(data: Uint8Array): Promise<IImageData> {
        const json = JSON.parse(data.toString());
        if (json.error !== undefined) {
            throw json.error;
        }

        if (json.data === undefined) {
            throw { error: `Failed to edit image` };
        }

        const result = {
            created: json.created,
            data: new Array<Buffer>()
        };

        for (const d of json.data) {
            result.data.push(Buffer.from(d.b64_json, "base64"));
        }

        return result
    }
}

export abstract class BaseImageUploadHandler extends BaseImageHandler {
    public request: IImageEditRequest | IImageVariationRequest;
    constructor (request: IImageEditRequest | IImageVariationRequest) {
        super();
        this.request = request;
    }

    public override getFormData(): IFormEntry[] | undefined {

        const editRequest = this.request as IImageEditRequest;
        const prompt = editRequest.prompt;
        const mask = editRequest.mask;
        const mask_filename = editRequest.mask_filename;

        const formEntries: Array<IFormEntry> = [{
            name: "image",
            filename: this.request.image_filename ?? "image.png",
            buf: this.request.image,
            mime: "image/png"
        }, {
            // note: only support for b64_json - write your own images
            name: "response_format",
            value: "b64_json"
        }];

        if (prompt !== undefined) {
            formEntries.push({
                name: "prompt",
                value: prompt
            });
        }
        if (mask !== undefined) {
            formEntries.push({
                name: "mask",
                filename: mask_filename ?? "mask.png",
                buf: mask,
                mime: "image/png"
            });
        }
        if (this.request.n !== undefined) {
            formEntries.push({
                name: "n",
                value: this.request.n.toString()
            });
        }
        if (this.request.size !== undefined) {
            formEntries.push({
                name: "size",
                value: this.request.size
            });
        }
        if (this.request.user !== undefined) {
            formEntries.push({
                name: "user",
                value: this.request.user
            });
        }

        return formEntries;
    }
}

export class ImageGenerate extends BaseImageHandler {
    public request: IImageGenerateRequest;
    constructor (request: IImageGenerateRequest) {
        super();
        this.request = request;
    }

    public override getResourceUri(): string {
        return `https://api.openai.com/v1/images/generations`;
    }

    public override getPostData(): Buffer | undefined {
        return Buffer.from(JSON.stringify({
            ...this.request,
            // note: only support for b64_json - write your own images
            response_format: "b64_json"
        }));
    }
}

export class ImageEdit extends BaseImageUploadHandler {
    public override getResourceUri(): string {
        return `https://api.openai.com/v1/images/edits`;
    }
}

export class ImageVariation extends BaseImageUploadHandler {
    public override getResourceUri(): string {
        return `https://api.openai.com/v1/images/variations`;
    }
}

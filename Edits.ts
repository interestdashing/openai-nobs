import { ClientHandler, IResponseData } from "./Client";
import { ResponseError } from "./errors/ResponseError";

export interface IEditUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface IEditChoice {
    text: string;
    index: number;
}

export interface IEditData extends IResponseData {
    object: "edit";
    created: number;
    model: string;
    choices: Array<IEditChoice>;
    usage: IEditUsage;
}

export interface IEditRequest {
    model: string;
    instruction: string;
    input?: string; // default ""
    temperature?: number; // default 1
    top_p?: number; // default 1
    n?: number; // default 1
}

export class EditGet extends ClientHandler<IEditData> {
    public request: IEditRequest;
    constructor (request: IEditRequest) {
        super();
        this.request = request;
    }

    public override getResourceUri(): string {
        return `https://api.openai.com/v1/edits`;
    }

    public override getPostData(): Buffer | undefined {
        return Buffer.from(JSON.stringify(this.request));
    }

    public override async parseResult(data: Uint8Array): Promise<IEditData> {
        const json = JSON.parse(data.toString());
        if (json.error !== undefined) {
            throw new ResponseError(JSON.stringify(json.error));
        }

        if (json.choices === undefined) {
            throw new ResponseError(`Failed to get edits data`);
        }

        return json;
    }
}

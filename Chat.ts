import { ClientHandler, IResponseData } from "./Client";

export enum ChatFinishReason {
    "LENGTH" = "length",
    "STOP" = "stop"
}

export enum ChatRole {
    "SYSTEM" = "system",
    "USER" = "user",
    "ASSISTANT" = "assistant"
}

export interface IChatMessage {
    role: ChatRole;
    content: string;
    name?: string;
}

export interface IChatUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface IChatChoice {
    index: number;
    finish_reason: ChatFinishReason;
    message: IChatMessage;
}

export interface IChatData extends IResponseData {
    id: string;
    object: "chat.completion";
    created: number;
    model: string;
    choices: Array<IChatChoice>;
    usage: IChatUsage;
}

export interface IChatRequest {
    model: string;
    messages: Array<IChatMessage>;
    max_tokens?: number; // default 16
    temperature?: number; // default 1
    top_p?: number; // default 1
    n?: number; // default 1
    stream?: boolean; // default false
    stop?: string | Array<string>; // default undefined
    presence_penalty?: number; // default 0
    frequency_penalty?: number; // default 0
    logit_bias?: { [key: string]: number }; // default undefined
    user?: string;
}

export class ChatGet extends ClientHandler<IChatData> {
    public request: IChatRequest;
    constructor (request: IChatRequest) {
        super();
        this.request = request;
    }

    public override getResourceUri(): string {
        return `https://api.openai.com/v1/chat/completions`;
    }

    public override getPostData(): Buffer | undefined {
        return Buffer.from(JSON.stringify(this.request));
    }

    public override async parseResult(data: Uint8Array): Promise<IChatData> {
        const json = JSON.parse(data.toString());
        if (json.error !== undefined) {
            throw json.error;
        }

        if (json.id === undefined) {
            throw { error: `Failed to get chat data` };
        }

        return json;
    }
}

import { ClientHandler, IResponseData } from "./Client";
import { ResponseError } from "./errors/ResponseError";

export type CompletionFinishReason = "length";

export interface ICompletionLogProbs {
    tokens: Array<string>;
    token_logprobs: Array<number>;
    top_logprobs: Array<{ [key: string]: number }>;
    text_offset: Array<number>;
}

export interface ICompletionChoice {
    text: string;
    index: number;
    logprobs: Array<ICompletionLogProbs>;
    finish_reason: CompletionFinishReason;
}

export interface ICompletionUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface ICompletionsData extends IResponseData {
    id: string;
    object: "text_completion";
    created: number;
    model: string;
    choices: Array<ICompletionChoice>;
    usage: ICompletionUsage;
}

export interface ICompletionsRequest {
    model: string;
    prompt?: string | Array<string>; // default <|endoftext|>
    suffix?: string;
    max_tokens?: number; // default 16
    temperature?: number; // default 1
    top_p?: number; // default 1
    n?: number; // default 1
    stream?: boolean; // default false
    logprobs?: number; // default undefined
    echo?: boolean; // default false
    stop?: string | Array<string>; // default undefined
    presence_penalty?: number; // default 0
    frequency_penalty?: number; // default 0
    best_of?: number;  // default 1
    logit_bias?: { [key: string]: number }; // default undefined
    user?: string;
}

export class CompletionsGet extends ClientHandler<ICompletionsData> {
    public request: ICompletionsRequest;
    constructor (request: ICompletionsRequest) {
        super();
        this.request = request;
    }

    public override getResourceUri(): string {
        return `https://api.openai.com/v1/completions`;
    }

    public override getPostData(): Buffer | undefined {
        return Buffer.from(JSON.stringify(this.request));
    }

    public override async parseResult(data: Uint8Array): Promise<ICompletionsData> {
        const json = JSON.parse(data.toString());
        if (json.error !== undefined) {
            throw new ResponseError(JSON.stringify(json.error));
        }

        if (json.id === undefined) {
            throw new ResponseError(`Failed to get completions data`);
        }

        return json;
    }
}

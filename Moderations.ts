import { ClientHandler, IResponseData } from "./Client";

export type ModerationCategory = "hate" | "hate/threatening" | "self-harm" | "sexual" | "sexual/minors" | "violence" | "violence/graphic";

export interface IModerationResult {
    categories: { [key in ModerationCategory]: boolean };
    category_scores: { [key in ModerationCategory]: number };
    flagged: boolean;
}
export interface IModerationsData extends IResponseData {
    id: string;
    model: string;
    results: Array<IModerationResult>
}

export interface IModerationRequest {
    input: string | Array<string>;
    model?: string;
}

export class ModerationsGet extends ClientHandler<IModerationsData> {
    public request: IModerationRequest;
    constructor (request: IModerationRequest) {
        super();
        this.request = request;
    }

    public override getResourceUri(): string {
        return `https://api.openai.com/v1/moderations`;
    }

    public override getPostData(): Buffer | undefined {
        return Buffer.from(JSON.stringify(this.request));
    }

    public override async parseResult(data: Uint8Array): Promise<IModerationsData> {
        const json = JSON.parse(data.toString());
        if (json.error !== undefined) {
            throw json.error;
        }

        if (json.id === undefined) {
            throw { error: `Failed to get moderation data` };
        }

        return {
            ...json,
        };
    }
}

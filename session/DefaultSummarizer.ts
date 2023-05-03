import { Client } from "../Client";
import { DefaultError } from "../errors/DefaultError";
import { IModelFetcher } from "./IModelFetcher";
import { ISummarizer } from "./ISummarizer";
import { SessionType } from "./SessionType";

export class DefaultSummarizer implements ISummarizer {
    public client: Client;
    public modelFetcher: IModelFetcher;

    // why cant this be discovered via model api?
    protected _maxTokenLookup: { [key in SessionType]: number } = {
        "audio": Number.MAX_VALUE,
        "chat": 4096,
        "completions": 2049,
        "edits": 2049,
        "images": 400
    };

    constructor(client: Client, modelFetcher: IModelFetcher) {
        this.client = client;
        this.modelFetcher = modelFetcher;
    }
    
    public needsSummary(input: string, forType: SessionType): boolean {
        // until used, return false
        return false;
    }

    public async getSummary(input: string, forType: SessionType): Promise<string> {
        throw new DefaultError("Not implemented");
    }
}

import { Client, IClientOptions } from "../Client";
import { ISummarizer } from "./ISummarizer";
import { DefaultSummarizer } from "./DefaultSummarizer";
import { IModelFetcher } from "./IModelFetcher";
import { DefaultModelFetcher } from "./DefaultModelFetcher";
import { IModerator } from "./IModerator";
import { DefaultModerator } from "./DefaultModerator";

interface IGenericSessionOptionsBase {
    autoModeration?: boolean;
    autoSummarize?: boolean;

    summarizer?: ISummarizer;
    moderator?: IModerator;
    modelFetcher?: IModelFetcher;
}

export interface IGenericSessionOptions extends IGenericSessionOptionsBase, IClientOptions {

}

export interface IGenericSessionOptionsInit extends IGenericSessionOptionsBase {
    client: Client;
}

export class GenericSession {
    public client: Client;
    public summarizer: ISummarizer;
    public moderator: IModerator;
    public modelFetcher: IModelFetcher;
    protected _options: IGenericSessionOptions | IGenericSessionOptionsInit;

    constructor(options: IGenericSessionOptions | IGenericSessionOptionsInit) {
        const clientOptions = options as IGenericSessionOptions;
        const initOptions = options as IGenericSessionOptionsInit;
        this.client = initOptions.client ?? new Client(clientOptions);
        
        this.modelFetcher = options.modelFetcher ?? new DefaultModelFetcher(this.client);
        this.summarizer = options.summarizer ?? new DefaultSummarizer(this.client, this.modelFetcher);
        this.moderator = options.moderator ?? new DefaultModerator(this.client);

        this._options = options;
        this._options.autoModeration = this._options.autoModeration ?? true;
        this._options.autoSummarize = this._options.autoSummarize ?? true;
    }
}

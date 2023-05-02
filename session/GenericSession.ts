import { Client, IClientOptions } from "../Client";
import { IModelData, ModelList } from "../Models";
import { ModerationsGet } from "../Moderations";
import { RequestError } from "../errors/RequestError";
import { ModerationError } from "../errors/ModerationError";

export interface IGenericSessionOptions extends IClientOptions {
    models?: Array<IModelData>;
    autoModeration?: boolean;
}

export class GenericSession {
    public client: Client;
    protected _options: IGenericSessionOptions;
    protected _models?: Array<IModelData>;
    protected _modelsPromise?: Promise<Array<IModelData>>;

    constructor(options: IGenericSessionOptions) {
        this.client = new Client(options);
        this._models = options.models;

        this._options = options;
        this._options.autoModeration = this._options.autoModeration ?? true;
    }

    public getCachedModels(): Array<IModelData> | undefined {
        return this._models;
    }

    protected async _requireModeration(input: string | Array<string>): Promise<void> {
        const moderations = await this.client.makeRequest(new ModerationsGet({ input }));
        for (const mod of moderations.results) {
            if (mod.flagged) {
                throw new ModerationError(mod);
            }
        }
    }

    protected async _getModels(): Promise<Array<IModelData>> {
        let models = this._models;
        if (models === undefined) {
            if (this._modelsPromise === undefined) {
                this._modelsPromise = this._getModelList();
            }
            models = await this._modelsPromise;
        }
        this._models = models;
        return this._models;
    }

    protected async _requireModelId(model: string | undefined, idMatches: Array<RegExp | string>): Promise<string> {
        if (model === undefined) {
            const foundModel = await this._requireModel(idMatches);
            model = foundModel.id;
        }
        return model;
    }

    protected async _requireModel(idMatches: Array<RegExp | string>): Promise<IModelData> {
        const models = await this._getModels();
        for (const model of models) {
            for (const idMatch of idMatches) {
                if (typeof idMatch === "string") {
                    if (model.id.includes(idMatch)) {
                        return model;
                    }
                } else if (idMatch.test(model.id)) {
                    return model;
                }
            }
        }
        throw new RequestError(`Unable to find model using matches '${JSON.stringify(idMatches)}'`);
    }

    private async _getModelList(): Promise<Array<IModelData>> {
        const result = await this.client.makeRequest(new ModelList());
        return result.data;
    }
}

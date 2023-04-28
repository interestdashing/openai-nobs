import { Client, IClientOptions } from "../Client";
import { IModelData, ModelList } from "../Models";

export interface IGenericSessionOptions extends IClientOptions {
    models?: Array<IModelData>;
}

export class GenericSession {
    public client: Client;
    protected _models?: Array<IModelData>;
    protected _modelsPromise?: Promise<Array<IModelData>>;

    constructor(options: IGenericSessionOptions) {
        this.client = new Client(options);
        this._models = options.models;
    }

    public getCachedModels(): Array<IModelData> | undefined {
        return this._models;
    }

    public async getModels(): Promise<Array<IModelData>> {
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

    public async requireModelId(model: string | undefined, idMatches: Array<RegExp | string>): Promise<string> {
        if (model === undefined) {
            const foundModel = await this.requireModel(idMatches);
            model = foundModel.id;
        }
        return model;
    }

    public async requireModel(idMatches: Array<RegExp | string>): Promise<IModelData> {
        const models = await this.getModels();
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
        throw { error: `Unable to find model using matches '${JSON.stringify(idMatches)}'` };
    }

    private async _getModelList(): Promise<Array<IModelData>> {
        const result = await this.client.makeRequest(new ModelList());
        return result.data;
    }
}

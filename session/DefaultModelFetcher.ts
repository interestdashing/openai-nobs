import { Client } from "../Client";
import { IModelData, ModelList } from "../Models";
import { RequestError } from "../errors/RequestError";
import { IModelFetcher } from "./IModelFetcher";
import { SessionType } from "./SessionType";

export class DefaultModelFetcher implements IModelFetcher {
    public client: Client;
    protected _models?: Array<IModelData>;
    protected _modelsPromise?: Promise<Array<IModelData>>;

    // why do we have to hard code these, why is it not discoverable....
    private _modelIdLookup: { [key in SessionType]: Array<string> } = {
        "audio": ["whisper"],
        "chat": ["gpt-4", "gpt-3.5"],
        "completions": ["text-curie"],
        "edits": ["text-davinci-edit"],
        "images": []
    }

    constructor(client: Client) {
        this.client = client;
    }

    public getCachedModels(): IModelData[] | undefined {
        return this._models;
    }

    public async requireModelId(model: string | undefined, type: SessionType): Promise<string> {
        if (model === undefined) {
            const foundModel = await this._requireModel(this._modelIdLookup[type]);
            model = foundModel.id;
        }
        return model;
    }

    private async _getModels(): Promise<Array<IModelData>> {
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

    private async _requireModel(idMatches: Array<string>): Promise<IModelData> {
        const models = await this._getModels();
        for (const model of models) {
            for (const idMatch of idMatches) {
                if (model.id.includes(idMatch)) {
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

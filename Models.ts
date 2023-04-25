import { ClientHandler, IResponseData } from "./Client";

export interface IModelData {
    id: string;
    object: "model";
    owned_by: string;
    root?: string;
    parent?: string;
}
export interface IListModelsData extends IResponseData {
    data: Array<IModelData>;
}

export class ModelList extends ClientHandler<IListModelsData> {
    public override getResourceUri(): string {
        return "https://api.openai.com/v1/models";
    }
    public override async parseResult(data: Uint8Array): Promise<IListModelsData> {
        const json = JSON.parse(data.toString());
        if (json.error !== undefined) {
            throw json.error;
        }

        if (json.data === undefined) {
            throw { error: "Failed to find model data in response." };
        }

        return json;
    }
}

export class ModelGet extends ClientHandler<IModelData> {
    public modelId: string;
    constructor (modelId: string) {
        super();
        this.modelId = modelId;
    }

    public override getResourceUri(): string {
        return `https://api.openai.com/v1/models/${this.modelId}`;
    }
    public override async parseResult(data: Uint8Array): Promise<IModelData> {
        const json = JSON.parse(data.toString());
        if (json.error !== undefined) {
            throw json.error;
        }

        if (json.id === undefined || json.owned_by === undefined) {
            throw { error: `Failed to get model data for id ${this.modelId}` };
        }

        return json;
    }
}
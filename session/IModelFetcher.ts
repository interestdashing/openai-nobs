import { SessionType } from "./SessionType";

export interface IModelFetcher {
    requireModelId(model: string | undefined, type: SessionType): Promise<string>;
}

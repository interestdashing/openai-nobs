import { EditGet, IEditData, IEditRequest } from "../Edits";
import { GenericSession } from "./GenericSession";

export interface IEditsSessionRequest extends Omit<IEditRequest, "model"> {
    model?: string;
}

/*
 * The EditsSession class provides a utility layer on top of the raw OpenAI API for ease of use.
*/
export class EditsSession extends GenericSession {
    public static DEFAULT_MODEL_IDS = ["text-davinci-edit"];

    public async edit(request: IEditsSessionRequest): Promise<IEditData> {
        return this.client.makeRequest(new EditGet({
            ...request,
            model: await this.requireModelId(request.model, EditsSession.DEFAULT_MODEL_IDS)
        }));
    }
}

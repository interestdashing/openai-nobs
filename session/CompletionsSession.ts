import { CompletionsGet, ICompletionsData, ICompletionsRequest } from "../Completions";
import { GenericSession } from "./GenericSession";

export interface ICompletionSessionRequest extends Omit<ICompletionsRequest, "model"> {
    model?: string;
}

/*
 * The CompletionsSession class provides a utility layer on top of the raw OpenAI API for ease of use.
 * Specific benefits over the raw API include:
 *  - Automatically finding an available model to use
 *  - Automatically moderating input via the Moderations endpoint
*/
export class CompletionsSession extends GenericSession {
    public static DEFAULT_MODEL_IDS = ["text-curie"];

    public async complete(request: ICompletionSessionRequest): Promise<ICompletionsData> {
        if (request.prompt && this._options.autoModeration) {
            await this._requireModeration(request.prompt);
        }
        
        return this.client.makeRequest(new CompletionsGet({
            ...request,
            model: await this._requireModelId(request.model, CompletionsSession.DEFAULT_MODEL_IDS)
        }));
    }
}

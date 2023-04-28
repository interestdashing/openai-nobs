import { CompletionsGet, ICompletionsData, ICompletionsRequest } from "../Completions";
import { GenericSession } from "./GenericSession";

export interface ICompletionSessionRequest extends Omit<ICompletionsRequest, "model"> {
    model?: string;
}

/*
 * The CompletionsSession class provides a utility layer on top of the raw OpenAI API for ease of use.
*/
export class CompletionsSession extends GenericSession {
    public static DEFAULT_MODEL_IDS = ["text-curie"];

    public async complete(request: ICompletionSessionRequest): Promise<ICompletionsData> {
        return this.client.makeRequest(new CompletionsGet({
            ...request,
            model: await this.requireModelId(request.model, CompletionsSession.DEFAULT_MODEL_IDS)
        }));
    }
}

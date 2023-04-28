import { 
    ChatGet, 
    IChatChoice, 
    IChatData, 
    IChatMessage, 
    IChatRequest
} from "../Chat";

import { GenericSession } from "./GenericSession";

export interface IChatSessionRequest extends Omit<IChatRequest, "model"> {
    model?: string;
}

export interface IChatSessionResponseRequest extends Omit<IChatRequest, "model" | "messages"> {
    model?: string;
}

/*
 * The ChatSession class provides a utility layer on top of the raw OpenAI API for ease of use.
*/
export class ChatSession extends GenericSession {
    public static DEFAULT_MODEL_IDS = ["gpt-4", "gpt-3.5"];
    public messages = new Array<IChatMessage>();

    public addMessage(message: IChatMessage): void {
        this.messages.push(message);
    }

    public async getResponses(request: IChatSessionResponseRequest): Promise<Array<IChatChoice>> {
        const result = await this.client.makeRequest(new ChatGet({
            ...request,
            messages: this.messages,
            model: await this.requireModelId(request.model, ChatSession.DEFAULT_MODEL_IDS)
        }));

        return result.choices;
    }

    public async setChat(request: IChatSessionRequest): Promise<IChatData> {
        this.messages = request.messages;
        return this.client.makeRequest(new ChatGet({
            ...request,
            model: await this.requireModelId(request.model, ChatSession.DEFAULT_MODEL_IDS)
        }));
    }
}

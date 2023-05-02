import { 
    ChatGet,
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
 * Specific benefits over the raw API include:
 *  - Automatically finding an available model to use
 *  - Automatically moderating input via the Moderations endpoint
*/
export class ChatSession extends GenericSession {
    public static DEFAULT_MODEL_IDS = ["gpt-4", "gpt-3.5"];
    public messages = new Array<IChatMessage>();

    public addMessage(message: IChatMessage): void {
        this.messages.push(message);
    }

    public async setChat(request: IChatSessionRequest): Promise<IChatData> {
        this.messages = request.messages;
        return this.getResponses(request);
    }

    public async getResponses(request: IChatSessionResponseRequest = {}): Promise<IChatData> {
        if (this._options.autoModeration) {
            const msgs = this.messages.map((v) => v.content);
            await this._requireModeration(msgs);
        }

        const result = await this.client.makeRequest(new ChatGet({
            ...request,
            messages: this.messages,
            model: await this._requireModelId(request.model, ChatSession.DEFAULT_MODEL_IDS)
        }));

        return result;
    }
}

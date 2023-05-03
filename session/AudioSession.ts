import { 
    AudioTranscription, 
    AudioTranslation, 
    IAudioTranscriptionData, 
    IAudioTranscriptionRequest, 
    IAudioTranslationRequest
} from "../Audio";
import { GenericSession } from "./GenericSession";

export interface IAudioSessionTranscriptionRequest extends Omit<IAudioTranscriptionRequest, "model"> {
    model?: string;
}

export interface IAudioSessionTranslationRequest extends Omit<IAudioTranslationRequest, "model"> {
    model?: string;
}

/*
 * The AudioSession class provides a utility layer on top of the raw OpenAI API for ease of use.
 * Specific benefits over the raw API include:
 *  - Automatically finding an available model to use
 *  - Automatically moderating input via the Moderations endpoint
*/
export class AudioSession extends GenericSession {
    public async transcribe(request: IAudioSessionTranscriptionRequest): Promise<IAudioTranscriptionData> {
        if (request.prompt && this._options.autoModeration) {
            await this.moderator.checkModerations(request.prompt);
        }

        return this.client.makeRequest(new AudioTranscription({
            ...request,
            model: await this.modelFetcher.requireModelId(request.model, "audio")
        }));
    }

    public async translate(request: IAudioSessionTranslationRequest): Promise<IAudioTranscriptionData> {
        if (request.prompt && this._options.autoModeration) {
            await this.moderator.checkModerations(request.prompt);
        }
        
        return this.client.makeRequest(new AudioTranslation({
            ...request,
            model: await this.modelFetcher.requireModelId(request.model, "audio")
        }));
    }
}

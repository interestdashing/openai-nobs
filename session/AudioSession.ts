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
*/
export class AudioSession extends GenericSession {
    public static DEFAULT_MODEL_IDS = ["whisper"];
    public async transcribe(request: IAudioSessionTranscriptionRequest): Promise<IAudioTranscriptionData> {
        return this.client.makeRequest(new AudioTranscription({
            ...request,
            model: await this.requireModelId(request.model, AudioSession.DEFAULT_MODEL_IDS)
        }));
    }

    public async translate(request: IAudioSessionTranslationRequest): Promise<IAudioTranscriptionData> {
        return this.client.makeRequest(new AudioTranslation({
            ...request,
            model: await this.requireModelId(request.model, AudioSession.DEFAULT_MODEL_IDS)
        }));
    }
}

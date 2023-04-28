import * as path from "path";
import { ClientHandler, IFormEntry, IResponseData } from "./Client";

export type TranscriptionFormat = "json" | "text" | "srt" | "verbose_json" | "vtt";

export interface IAudioTranscriptionSegment {
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: Array<number>;
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
    transient: boolean;
}

export interface IAudioTranscriptionVerbose {
    task?: string;
    language?: string;
    duration?: number;
    segments?: Array<IAudioTranscriptionSegment>;
}

export interface IAudioTranscriptionData extends IAudioTranscriptionVerbose, IResponseData {
    text: string;
}

export interface IAudioUploadRequest {
    audio: Buffer,
    audio_filename: string;
    model: string;
    prompt?: string;
    response_format?: TranscriptionFormat;
    temperature?: number; // default 0
}

export interface IAudioTranslationRequest extends IAudioUploadRequest {

}

export interface IAudioTranscriptionRequest extends IAudioUploadRequest {
    language?: string;
}

export abstract class BaseAudioHandler extends ClientHandler<IAudioTranscriptionData> {
    public request: IAudioTranscriptionRequest | IAudioUploadRequest;
    constructor (request: IAudioTranscriptionRequest | IAudioUploadRequest) {
        super();
        this.request = request;
    }

    private _getMimeFromExtension(ext: string): string {
        if (ext === "mp4" || ext === "m4a") {
            return "audio/mp4";
        } else if (ext === "mpeg" || ext === "mp3" || ext === "mpga") {
            return "audio/mpeg";
        } else if (ext === "wav") {
            return "audio/wav";
        } else if (ext === "webm") {
            return "audio/webm";
        }
        return "audio/mp4";
    }

    public override getFormData(): IFormEntry[] | undefined {
        const formEntries: Array<IFormEntry> = [{
            name: "file",
            filename: this.request.audio_filename,
            buf: this.request.audio,
            mime: this._getMimeFromExtension(path.extname(this.request.audio_filename))
        }, {
            name: "model",
            value: this.request.model
        }, {
            name: "response_format",
            value: this.request.response_format ?? "verbose_json",
        }];

        if (this.request.prompt !== undefined) {
            formEntries.push({
                name: "prompt",
                value: this.request.prompt
            });
        }
        if (this.request.temperature !== undefined) {
            formEntries.push({
                name: "temperature",
                value: this.request.temperature.toString()
            });
        }
        const transcriptRequest = (this.request as IAudioTranscriptionRequest);
        if (transcriptRequest.language !== undefined) {
            formEntries.push({
                name: "language",
                value: transcriptRequest.language
            });
        }

        return formEntries;
    }

    public override async parseResult(data: Uint8Array): Promise<IAudioTranscriptionData> {
        const raw = data.toString();

        switch (this.request.response_format) {
            case "text":
            case "vtt":
            case "srt":
                return { text: raw };
            case "verbose_json":
            case "json":
            case undefined:
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed.text === undefined) {
                        throw { error: `Failed to parse text property from audio response.` }
                    }
                    return parsed;
                } catch (e) {
                    throw e;
                }
        }
    }
}

export class AudioTranscription extends BaseAudioHandler {
    public override getResourceUri(): string {
        return `https://api.openai.com/v1/audio/transcriptions`;
    }
}

export class AudioTranslation extends BaseAudioHandler {
    public override getResourceUri(): string {
        return `https://api.openai.com/v1/audio/translations`;
    }
}

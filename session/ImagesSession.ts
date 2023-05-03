import { 
    IImageData, 
    IImageEditRequest, 
    IImageGenerateRequest, 
    IImageVariationRequest, 
    ImageEdit, 
    ImageGenerate, 
    ImageVariation 
} from "../Images";
import { GenericSession } from "./GenericSession";

/*
 * The ImagesSession class provides a utility layer on top of the raw OpenAI API for ease of use.
 * Specific benefits over the raw API include:
 *  - Automatically finding an available model to use
 *  - Automatically moderating input via the Moderations endpoint
*/
export class ImagesSession extends GenericSession {
    public async generate(request: IImageGenerateRequest): Promise<IImageData> {
        if (this._options.autoModeration) {
            await this.moderator.checkModerations(request.prompt);
        }
        if (this._options.autoSummarize && this.summarizer.needsSummary(request.prompt, "images")) {
            request.prompt = await this.summarizer.getSummary(request.prompt, "images");
        }
        return this.client.makeRequest(new ImageGenerate(request));
    }

    public async edit(request: IImageEditRequest): Promise<IImageData> {
        if (this._options.autoModeration) {
            await this.moderator.checkModerations(request.prompt);
        }
        return this.client.makeRequest(new ImageEdit(request));
    }

    public async variant(request: IImageVariationRequest): Promise<IImageData> {
        return this.client.makeRequest(new ImageVariation(request));
    }
}

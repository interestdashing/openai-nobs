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
*/
export class ImagesSession extends GenericSession {
    public async generate(request: IImageGenerateRequest): Promise<IImageData> {
        return this.client.makeRequest(new ImageGenerate(request));
    }

    public async edit(request: IImageEditRequest): Promise<IImageData> {
        return this.client.makeRequest(new ImageEdit(request));
    }

    public async variant(request: IImageVariationRequest): Promise<IImageData> {
        return this.client.makeRequest(new ImageVariation(request));
    }
}

import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { SAMPLE_API_KEY } from "./Config";
import { ImagesSession, ModerationError } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "ImagesSession: generate image",
        run: async (config: ISampleConfig) => {
            const client = new ImagesSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
            const result = await client.generate({
                prompt: "cartoon drawing of a rat",
                n: 2,
            });
            for (let i = 0; i < result.data.length; i++) {
                fs.writeFileSync(path.join(config.outputPath, `imagessession-generate${i}.png`), result.data[i]);
            }
        }
    }, {
        name: "ImagesSession: generate moderation",
        run: async (config: ISampleConfig) => {
            const client = new ImagesSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            try {
                await client.generate({
                    prompt: "Test moderation request. I am going to punch you in the face."
                });
            } catch (e) {
                if (e instanceof ModerationError) {
                    fs.writeFileSync(path.join(config.outputPath, "imagessession-generate-moderation.txt"), JSON.stringify(e, undefined, 4));
                }
            }
        }
    }, {
        name: "ImagesSession: edit image",
        run: async (config: ISampleConfig) => {
            const client = new ImagesSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
            const result = await client.edit({
                image: fs.readFileSync(path.join(config.inputPath, "cat-paw.png")),
                mask: fs.readFileSync(path.join(config.inputPath, "cat-paw-mask.png")),
                prompt: "Make the cats paw have sharp looking dagger like claws.",
                n: 2,
            });
            for (let i = 0; i < result.data.length; i++) {
                fs.writeFileSync(path.join(config.outputPath, `imagessession-edit${i}.png`), result.data[i]);
            }
        }
    }, {
        name: "ImagesSession: variation",
        run: async (config: ISampleConfig) => {
            const client = new ImagesSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
            const result = await client.variant({
                image: fs.readFileSync(path.join(config.inputPath, "cat-paw.png")),
                n: 2,
            });
            for (let i = 0; i < result.data.length; i++) {
                fs.writeFileSync(path.join(config.outputPath, `imagessession-variation${i}.png`), result.data[i]);
            }
        }
    }];
};

export {
    getSamples
};

import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { SAMPLE_API_KEY } from "./Config";
import { Client, ImageEdit, ImageGenerate, ImageVariation } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Images: generate image",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
            const result = await client.makeRequest(new ImageGenerate({
                prompt: "Picture of a cat's paw.",
                n: 2,
            }));
            for (let i = 0; i < result.data.length; i++) {
                fs.writeFileSync(path.join(config.outputPath, `images-generate${i}.png`), result.data[i]);
            }
        }
    }, {
        name: "Images: edit image",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
            const result = await client.makeRequest(new ImageEdit({
                image: fs.readFileSync(path.join(config.inputPath, "cat-paw.png")),
                mask: fs.readFileSync(path.join(config.inputPath, "cat-paw-mask.png")),
                prompt: "Make the cats paw have sharp looking dagger like claws.",
                n: 2,
            }));
            for (let i = 0; i < result.data.length; i++) {
                fs.writeFileSync(path.join(config.outputPath, `images-edit${i}.png`), result.data[i]);
            }
        }
    }, {
        name: "Images: variation",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
            const result = await client.makeRequest(new ImageVariation({
                image: fs.readFileSync(path.join(config.inputPath, "cat-paw.png")),
                n: 2,
            }));
            for (let i = 0; i < result.data.length; i++) {
                fs.writeFileSync(path.join(config.outputPath, `images-variation${i}.png`), result.data[i]);
            }
        }
    }];
};

export {
    getSamples
};

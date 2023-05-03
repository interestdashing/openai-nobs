import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { SAMPLE_API_KEY } from "./Config";
import { EditsSession, ModerationError } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "EditsSession: fix spelling mistakes",
        run: async (config: ISampleConfig) => {
            const session = new EditsSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await session.edit({
                instruction: "Fix the spelling mistakes and make it sound more profound.",
                input: "Waht is the poirpose of lyfe?",
            });
        
            fs.writeFileSync(path.join(config.outputPath, "editssession-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }, {
        name: "EditsSession: edit moderation",
        run: async (config: ISampleConfig) => {
            const session = new EditsSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            try {
                await session.edit({
                    instruction: "Fix the spelling mistakes and make it sound more profound.",
                    input: "Test moderation request. I am going to punch you in the face.",
                });
            } catch (e) {
                if (e instanceof ModerationError) {
                    fs.writeFileSync(path.join(config.outputPath, "editssession-moderation.txt"), JSON.stringify(e, undefined, 4));
                }
            }
        }
    }];
};

export {
    getSamples
};

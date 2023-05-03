import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { SAMPLE_API_KEY } from "./Config";
import { CompletionsSession, ModerationError } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "CompletionsSession: text completion",
        run: async (config: ISampleConfig) => {
            const session = new CompletionsSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await session.complete({
                prompt: "Write a 20 word summary of the cat in the hat."
            });
        
            fs.writeFileSync(path.join(config.outputPath, "completionssession-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }, {
        name: "CompletionsSession: completion moderation",
        run: async (config: ISampleConfig) => {
            const session = new CompletionsSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            try {
                await session.complete({
                    prompt: "Test moderation request. I am going to punch you in the face, what do you say?"
                });
            } catch (e) {
                if (e instanceof ModerationError) {
                    fs.writeFileSync(path.join(config.outputPath, "completionssession-moderation.txt"), JSON.stringify(e, undefined, 4));
                }
            }
        }
    }];
};

export {
    getSamples
};

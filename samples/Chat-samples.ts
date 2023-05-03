import * as fs from "fs";
import * as path from "path";
import { SAMPLE_API_KEY } from "./Config";
import { DefaultError } from "../errors/DefaultError";
import { ISample, ISampleConfig } from "./ISample";
import { Client, ChatGet, ModelList } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Chat: basic questions",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const modelResult = await client.makeRequest(new ModelList());
            const gptModel = modelResult.data.filter((m) => m.id.indexOf("gpt-3.5") !== -1)[0];
            if (gptModel === undefined) {
                throw new DefaultError(`Could not find gpt-3.5 based model`);
            }
        
            const result = await client.makeRequest(new ChatGet({
                model: gptModel.id,
                messages: [
                    { role: "user", content: "I am a dog." },
                    { role: "user", content: "What noises do I make?" },
                ],
                n: 2,
            }));
        
            fs.writeFileSync(path.join(config.outputPath, "chat-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }];
};

export {
    getSamples
};

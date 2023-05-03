import * as fs from "fs";
import * as path from "path";
import { SAMPLE_API_KEY } from "./Config";
import { ISample, ISampleConfig } from "./ISample";
import { Client, CompletionsGet, ModelList } from "../index";
import { DefaultError } from "../errors/DefaultError";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Completions: text completion",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const modelResult = await client.makeRequest(new ModelList());
            const curieModel = modelResult.data.filter((m) => m.id.indexOf("text-curie") !== -1)[0];
            if (curieModel === undefined) {
                throw new DefaultError(`Could not find text-curie based model`);
            }
        
            const result = await client.makeRequest(new CompletionsGet({
                model: curieModel.id,
                prompt: "Say this is a test",
                max_tokens: 7,
                logprobs: 2,
                n: 2,
            }));
        
            fs.writeFileSync(path.join(config.outputPath, "completions-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }];
};

export {
    getSamples
};

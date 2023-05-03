import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { SAMPLE_API_KEY } from "./Config";
import { Client, ModelGet, ModelList } from "../index";
import { DefaultError } from "../errors/DefaultError";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Models: list",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await client.makeRequest(new ModelList());
            fs.writeFileSync(path.join(config.outputPath, "models-list-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }, {
        name: "Models: get",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await client.makeRequest(new ModelList());
            if (result.data.length === 0) {
                throw new DefaultError(`Could not get list of models`);
            }
        
            const model = await client.makeRequest(new ModelGet(result.data[0].id));
            fs.writeFileSync(path.join(config.outputPath, "models-get-results.txt"), JSON.stringify(model, undefined, 4));
        }
    }];
};

export {
    getSamples
};

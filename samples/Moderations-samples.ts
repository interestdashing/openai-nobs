import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { SAMPLE_API_KEY } from "./Config";
import { Client, ModerationsGet } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Moderations: check",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await client.makeRequest(new ModerationsGet({
                input: "I am going to punch you in the face."
            }));
        
            fs.writeFileSync(path.join(config.outputPath, "moderations-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }];
};

export {
    getSamples
};

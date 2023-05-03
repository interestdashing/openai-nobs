import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { SAMPLE_API_KEY } from "./Config";
import { Client, ModelList, EditGet } from "../index";
import { DefaultError } from "../errors/DefaultError";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Edits: fix spelling mistakes",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const modelResult = await client.makeRequest(new ModelList());
            const editModel = modelResult.data.filter((m) => m.id.indexOf("text-davinci-edit") !== -1)[0];
            if (editModel === undefined) {
                throw new DefaultError(`Could not find text-davinci-edit based model`);
            }
        
            const result = await client.makeRequest(new EditGet({
                model: editModel.id,
                instruction: "Fix the spelling mistakes",
                input: "Waht is the poirpose of lyfe?",
                n: 2,
            }));
        
            fs.writeFileSync(path.join(config.outputPath, "edits-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }];
};

export {
    getSamples
};

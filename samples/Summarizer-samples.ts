import * as fs from "fs";
import * as path from "path";
import { ISample, ISampleConfig } from "./ISample";
import { DefaultSummarizer } from "../session/DefaultSummarizer";
import { Client } from "../Client";
import { SAMPLE_API_KEY } from "./Config";
import { DefaultModelFetcher } from "../session/DefaultModelFetcher";
import { DefaultError } from "../errors/DefaultError";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Summarizer: summarizes inputs",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });

            const summarizer = new DefaultSummarizer(client, new DefaultModelFetcher(client));
            const input = fs.readFileSync(path.join(config.inputPath, "short-story.txt")).toString();
            if (!summarizer.needsSummary(input, "images")) {
                throw new DefaultError("Expected summary to be required");
            }

            const result = await summarizer.getSummary(input, "images");

            if (summarizer.needsSummary(result, "images")) {
                throw new DefaultError("Expected summary not to need a summary");
            }

            fs.writeFileSync(path.join(config.outputPath, "summarizer-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }];
};

export {
    getSamples
};
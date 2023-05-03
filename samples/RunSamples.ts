import * as path from "path";
import * as fs from "fs";
import { ISampleConfig } from "./ISample";

import { getSamples as audioSamples } from "./Audio-samples";
import { getSamples as audioSessionSamples } from "./AudioSession-samples";

import { getSamples as chatSamples } from "./Chat-samples";
import { getSamples as chatSessionSamples } from "./ChatSession-samples";

import { getSamples as completionsSamples } from "./Completions-samples";
import { getSamples as completionsSessionSamples } from "./CompletionsSession-samples";

import { getSamples as editsSamples } from "./Edits-samples";
import { getSamples as editsSessionSamples } from "./EditsSession-samples";

import { getSamples as imagesSamples } from "./Images-samples";
import { getSamples as imagesSessionSamples } from "./ImagesSession-samples";

import { getSamples as modelsSamples } from "./Models-samples";
import { getSamples as moderationsSamples } from "./Moderations-samples";
import { getSamples as summarizerSamples } from "./Summarizer-samples";

interface ISampleResult {
    name: string;
    result: boolean;
    error?: unknown;
}

const results = new Array<ISampleResult>();
const config: ISampleConfig = {
    outputPath: path.join(__dirname, "../", "output"),
    inputPath: path.join(__dirname, "inputs"),
};

if (!fs.existsSync(config.outputPath)) {
    fs.mkdirSync(config.outputPath);
}

(async () => {
    const match = process.argv[2] ?? ".*";
    const allSamples = [
        ...audioSamples(),
        ...audioSessionSamples(),
        ...chatSamples(),
        ...chatSessionSamples(),
        ...completionsSamples(),
        ...completionsSessionSamples(),
        ...editsSamples(),
        ...editsSessionSamples(),
        ...imagesSamples(),
        ...imagesSessionSamples(),
        ...modelsSamples(),
        ...moderationsSamples(),
        ...summarizerSamples(),
    ]
    const samplesToRun = allSamples.filter((s => new RegExp(match).test(s.name)));

    for (const sample of samplesToRun) {
        try {
            console.debug(`Running sample '${sample.name}'...`);
            await sample.run(config);
            results.push({
                name: sample.name,
                result: true
            });
            console.debug(`Finished sample '${sample.name}'`);
        } catch (error: unknown) {
            console.debug(`Failure with sample '${sample.name}'`, error);
            results.push({
                name: sample.name,
                result: false,
                error
            });
        }
    }
})().catch((e: any) => {
    throw e;
}).finally(() => {
    console.table(results, ["name", "result"]);

    for (const r of results) {
        if (r.result === false) {
            console.error(`Sample '${r.name}' failed!`, r.error, "\n");
        }
    }
});
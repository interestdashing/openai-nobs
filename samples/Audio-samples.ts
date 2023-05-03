import * as fs from "fs";
import * as path from "path";
import { SAMPLE_API_KEY } from "./Config";
import { ISample, ISampleConfig } from "./ISample";
import { Client, AudioTranscription, AudioTranslation } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "Audio: transcribe to text",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await client.makeRequest(new AudioTranscription({
                audio: fs.readFileSync(path.join(config.inputPath, "audio-test.m4a")),
                audio_filename: "audio-test.m4a",
                model: "whisper-1", // only one available?
                language: "en"
            }));
        
            fs.writeFileSync(path.join(config.outputPath, "audio-transcribe-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }, {
        name: "Audio: translate Spanish to English text",
        run: async (config: ISampleConfig) => {
            const client = new Client({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await client.makeRequest(new AudioTranslation({
                audio: fs.readFileSync(path.join(config.inputPath, "audio-spanish.m4a")),
                audio_filename: "audio-test.m4a",
                model: "whisper-1", // only one available?
            }));
        
            fs.writeFileSync(path.join(config.outputPath, "audio-translate-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }]
};

export {
    getSamples
};

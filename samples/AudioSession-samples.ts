import * as fs from "fs";
import * as path from "path";
import { SAMPLE_API_KEY } from "./Config";
import { ISample, ISampleConfig } from "./ISample";
import { AudioSession, ModerationError } from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "AudioSession: transcribe to text",
        run: async (config: ISampleConfig) => {
            const session = new AudioSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await session.transcribe({
                audio: fs.readFileSync(path.join(config.inputPath, "audio-test.m4a")),
                audio_filename: "audio-test.m4a",
                language: "en"
            });

            fs.writeFileSync(path.join(config.outputPath, "audiosession-transcribe-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }, {
        name: "AudioSession: transcribe moderation",
        run: async (config: ISampleConfig) => {
            const session = new AudioSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            try {
                await session.transcribe({
                    audio: fs.readFileSync(path.join(config.inputPath, "audio-test.m4a")),
                    audio_filename: "audio-test.m4a",
                    prompt: "Test moderation request. I am going to punch you in the face.",
                    language: "en"
                });
            } catch (e) {
                if (e instanceof ModerationError) {
                    fs.writeFileSync(path.join(config.outputPath, "audiosession-transcribe-moderation.txt"), JSON.stringify(e, undefined, 4));
                }
            }
        }
    }, {
        name: "AudioSession: translate Spanish to English text",
        run: async (config: ISampleConfig) => {
            const session = new AudioSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            const result = await session.translate({
                audio: fs.readFileSync(path.join(config.inputPath, "audio-spanish.m4a")),
                audio_filename: "audio-test.m4a",
            });
        
            fs.writeFileSync(path.join(config.outputPath, "audiosession-translate-results.txt"), JSON.stringify(result, undefined, 4));
        }
    }, {
        name: "AudioSession: translate moderation",
        run: async (config: ISampleConfig) => {
            const session = new AudioSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            try {
                await session.translate({
                    audio: fs.readFileSync(path.join(config.inputPath, "audio-spanish.m4a")),
                    audio_filename: "audio-test.m4a",
                    prompt: "Test moderation request. I am going to punch you in the face."
                });
            } catch (e) {
                if (e instanceof ModerationError) {
                    fs.writeFileSync(path.join(config.outputPath, "audiosession-translate-moderation.txt"), JSON.stringify(e, undefined, 4));
                }
            }
        }
    }];
};

export {
    getSamples
};

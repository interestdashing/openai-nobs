import * as fs from "fs";
import * as path from "path";
import { SAMPLE_API_KEY } from "./Config";
import { AudioSession, ModerationError } from "../index";

/*
 * Transcribe audio to text sample.
*/ 
(async () => {
    const session = new AudioSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await session.transcribe({
        audio: fs.readFileSync(path.join(__dirname, "inputs", "audio-test.m4a")),
        audio_filename: "audio-test.m4a",
        language: "en"
    });

    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure transcribing audio`, e);
});

/*
 * Transcribe audio to text sample with moderation.
*/ 
(async () => {
    const session = new AudioSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    try {
        await session.transcribe({
            audio: fs.readFileSync(path.join(__dirname, "inputs", "audio-test.m4a")),
            audio_filename: "audio-test.m4a",
            prompt: "Test moderation request. I am going to punch you in the face.",
            language: "en"
        });
    } catch (e) {
        if (e instanceof ModerationError) {
            console.log("Expected moderation failure", e);
        }
    }
})().catch((e) => {
    console.error(`Failure transcribing audio`, e);
});

/*
 * Translate Spanish audio to English text sample.
*/ 
(async () => {
    const session = new AudioSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await session.translate({
        audio: fs.readFileSync(path.join(__dirname, "inputs", "audio-spanish.m4a")),
        audio_filename: "audio-test.m4a",
    });

    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure translating audio`, e);
});

/*
 * Translate Spanish audio to English text sample with moderation request.
*/ 
(async () => {
    const session = new AudioSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    try {
        await session.translate({
            audio: fs.readFileSync(path.join(__dirname, "inputs", "audio-spanish.m4a")),
            audio_filename: "audio-test.m4a",
            prompt: "Test moderation request. I am going to punch you in the face."
        });
    } catch (e) {
        if (e instanceof ModerationError) {
            console.log("Expected moderation failure", e);
        }
    }
})().catch((e) => {
    console.error(`Failure translating audio`, e);
});

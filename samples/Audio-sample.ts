import * as fs from "fs";
import * as path from "path";
import { SAMPLE_API_KEY } from "./Config";
import { Client } from "../Client";
import { AudioTranscription, AudioTranslation, TranscriptionFormat } from "../Audio";

/*
 * Transcribe audio to text sample.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await client.makeRequest(new AudioTranscription({
        audio: fs.readFileSync(path.join(__dirname, "inputs", "audio-test.m4a")),
        audio_filename: "audio-test.m4a",
        model: "whisper-1", // only one available?
        language: "en"
    }));


    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure transcribing audio`, e);
});

/*
 * Transcribe Spanish audio to English text sample.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await client.makeRequest(new AudioTranslation({
        audio: fs.readFileSync(path.join(__dirname, "inputs", "audio-spanish-test.m4a")),
        audio_filename: "audio-test.m4a",
        model: "whisper-1", // only one available?
    }));


    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure translating audio`, e);
});

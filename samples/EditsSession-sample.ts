import { SAMPLE_API_KEY } from "./Config";
import { EditsSession, ModerationError } from "../index";

/*
 * Edits input with instruction
*/ 
(async () => {
    const session = new EditsSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await session.edit({
        instruction: "Fix the spelling mistakes and make it sound more profound.",
        input: "Waht is the poirpose of lyfe?",
    });

    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure transcribing audio`, e);
});

/*
 * Edits input with instruction and moderation request
*/ 
(async () => {
    const session = new EditsSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    try {
        await session.edit({
            instruction: "Fix the spelling mistakes and make it sound more profound.",
            input: "Test moderation request. I am going to punch you in the face.",
        });
    } catch (e) {
        if (e instanceof ModerationError) {
            console.log("Expected moderation failure", e);
        }
    }
})().catch((e) => {
    console.error(`Failure transcribing audio`, e);
});
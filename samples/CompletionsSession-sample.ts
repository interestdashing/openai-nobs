import { SAMPLE_API_KEY } from "./Config";
import { CompletionsSession, ModerationError } from "../index";

/*
 * Complete some text
*/ 
(async () => {
    const session = new CompletionsSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await session.complete({
        prompt: "Write a 20 word summary of the cat in the hat."
    });

    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure completing text`, e);
});

/*
 * Complete some text using automatic moderation.
*/ 
(async () => {
    const session = new CompletionsSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    try {
        await session.complete({
            prompt: "Test moderation request. I am going to punch you in the face, what do you say?"
        });
    } catch (e) {
        if (e instanceof ModerationError) {
            console.log("Expected moderation failure", e);
        }
    }
})().catch((e) => {
    console.error(`Failure completing text`, e);
});
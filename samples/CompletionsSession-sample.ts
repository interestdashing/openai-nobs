import { SAMPLE_API_KEY } from "./Config";
import { CompletionsSession } from "../index";

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
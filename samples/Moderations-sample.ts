import { SAMPLE_API_KEY } from "./Config";
import { Client } from "../Client";
import { ModerationCategory, ModerationsGet } from "../Moderations";

/*
 * Checks moderation values for input text.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await client.makeRequest(new ModerationsGet({
        input: "I am going to punch you in the face."
    }));

    console.log(JSON.stringify(result, undefined, 4));
    console.log(`Violence measured as ${result.results[0].category_scores[ModerationCategory.VIOLENCE]}` );
})().catch((e) => {
    console.error(`Failure getting moderations`, e);
});

import { SAMPLE_API_KEY } from "./Config";
import { Client, CompletionsGet, ModelList } from "../index";

/*
 * Completion example of asking for a simple text completion.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const modelResult = await client.makeRequest(new ModelList());
    const curieModel = modelResult.data.filter((m) => m.id.indexOf("text-curie") !== -1)[0];
    if (curieModel === undefined) {
        throw { error: "Could not find text-curie based model" };
    }

    const result = await client.makeRequest(new CompletionsGet({
        model: curieModel.id,
        prompt: "Say this is a test",
        max_tokens: 7,
        logprobs: 2,
        n: 2,
    }));

    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure listing models`, e);
});

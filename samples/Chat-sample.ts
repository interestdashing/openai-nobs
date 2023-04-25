import { SAMPLE_API_KEY } from "./Config";
import { Client, ChatRole, ChatGet, ModelList } from "../index";

/*
 * Chat sample that asks basic questions.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const modelResult = await client.makeRequest(new ModelList());
    const gptModel = modelResult.data.filter((m) => m.id.indexOf("gpt-3.5") !== -1)[0];
    if (gptModel === undefined) {
        throw { error: "Could not find gpt-3.5 based model" };
    }

    const result = await client.makeRequest(new ChatGet({
        model: gptModel.id,
        messages: [
            { role: ChatRole.USER, content: "I am a dog." },
            { role: ChatRole.USER, content: "What noises do I make?" },
        ],
        n: 2,
    }));

    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure getting chat`, e);
});

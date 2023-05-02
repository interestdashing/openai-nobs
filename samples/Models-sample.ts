import { SAMPLE_API_KEY } from "./Config";
import { Client, ModelGet, ModelList } from "../index";
import { DefaultError } from "../errors/DefaultError";

/*
 * List models sample.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await client.makeRequest(new ModelList());

    for (const model of result.data) {
        console.log(`Model '${model.id}', owner '${model.owned_by}'`);
    }
})().catch((e) => {
    console.error(`Failure listing models`, e);
});

/*
 * Get model sample.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await client.makeRequest(new ModelList());
    if (result.data.length === 0) {
        throw new DefaultError(`Could not get list of models`);
    }

    const model = await client.makeRequest(new ModelGet(result.data[0].id));
    console.log(JSON.stringify(model, undefined, 4));
})().catch((e) => {
    console.error(`Failure getting model`, e);
});

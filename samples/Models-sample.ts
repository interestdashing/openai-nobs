import { SAMPLE_API_KEY } from "./Config";
import { Client } from "../Client";
import { GetModel, ListModels } from "../Models";

/*
 * List models sample.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const result = await client.makeRequest(new ListModels());

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

    const result = await client.makeRequest(new ListModels());
    if (result.data.length === 0) {
        throw { error: "Could not get list of models" };
    }

    const model = await client.makeRequest(new GetModel(result.data[0].id));

    if (model.id !== result.data[0].id) {
        throw { error: "Model mismatch" };
    }

    console.log(JSON.stringify(model, undefined, 4));
})().catch((e) => {
    console.error(`Failure getting model`, e);
});

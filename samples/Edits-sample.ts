import { SAMPLE_API_KEY } from "./Config";
import { Client, ModelList, EditGet } from "../index";

/*
 * Edits sample to fix spelling mistakes.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    const modelResult = await client.makeRequest(new ModelList());
    const editModel = modelResult.data.filter((m) => m.id.indexOf("text-davinci-edit") !== -1)[0];
    if (editModel === undefined) {
        throw { error: "Could not find text-davinci-edit based model" };
    }

    const result = await client.makeRequest(new EditGet({
        model: editModel.id,
        instruction: "Fix the spelling mistakes",
        input: "Waht is the poirpose of lyfe?",
        n: 2,
    }));

    console.log(JSON.stringify(result, undefined, 4));
})().catch((e) => {
    console.error(`Failure with getting edit`, e);
});

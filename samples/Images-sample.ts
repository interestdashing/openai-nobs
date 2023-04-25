import * as fs from "fs";
import * as path from "path";

import { SAMPLE_API_KEY } from "./Config";
import { Client, ImageEdit, ImageGenerate, ImageVariation } from "../index";

const writeImage = (filename: string, data: Buffer) => {
    if (!fs.existsSync(path.join(__dirname, "..", "output"))) {
        fs.mkdirSync(path.join(__dirname, "..", "output"));
    }
    fs.writeFileSync(
        path.join(__dirname, "..", "output", filename),
        data
    );
};

/*
 * Image generation sample to generate a specific picture based on prompt.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });
    const result = await client.makeRequest(new ImageGenerate({
        prompt: "Picture of a cat's paw.",
        n: 2,
    }));
    for (let i = 0; i < result.data.length; i++) {
        writeImage(`generate-image${i}.png`, result.data[i]);
    }
})().catch((e) => {
    console.error(`Failure with generating image`, e);
});

/*
 * Edits an image with mask and prompt.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });
    const result = await client.makeRequest(new ImageEdit({
        image: fs.readFileSync(path.join(__dirname, "inputs", "cat-paw.png")),
        mask: fs.readFileSync(path.join(__dirname, "inputs", "cat-paw-mask.png")),
        prompt: "Make the cats paw have extended translucent claws.",
        n: 2,
    }));
    for (let i = 0; i < result.data.length; i++) {
        writeImage(`edit-image${i}.png`, result.data[i]);
    }
})().catch((e) => {
    console.error(`Failure with editing image`, e);
});

/*
 * Generate variation from existing image.
*/ 
(async () => {
    const client = new Client({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });
    const result = await client.makeRequest(new ImageVariation({
        image: fs.readFileSync(path.join(__dirname, "inputs", "cat-paw.png")),
        n: 2,
    }));
    for (let i = 0; i < result.data.length; i++) {
        writeImage(`edit-variation${i}.png`, result.data[i]);
    }
})().catch((e) => {
    console.error(`Failure with variation image`, e);
});

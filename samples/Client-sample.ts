import { SAMPLE_API_KEY } from "./Config";
import { Client } from "../Client";

new Client({
    apiKey: SAMPLE_API_KEY
});

new Client({
    apiKey: SAMPLE_API_KEY,
    organization: "abc"
});

// see specific validations in each component sample
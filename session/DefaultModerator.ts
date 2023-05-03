import { Client } from "../Client";
import { ModerationsGet } from "../Moderations";
import { ModerationError } from "../errors/ModerationError";
import { IModerator } from "./IModerator";

export class DefaultModerator implements IModerator {
    public client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async checkModerations(input: string | string[]): Promise<void> {
        const moderations = await this.client.makeRequest(new ModerationsGet({ input }));
        for (const mod of moderations.results) {
            if (mod.flagged) {
                throw new ModerationError(mod);
            }
        }
    }
}
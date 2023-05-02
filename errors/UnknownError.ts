import { DefaultError } from "./DefaultError";

export class UnknownError extends DefaultError {
    public override type = "Unknown";
    constructor(e: unknown) {
        super(`${e}`);
    }
}

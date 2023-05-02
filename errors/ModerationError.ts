import { IModerationResult } from "../Moderations";
import { DefaultError } from "./DefaultError";

export class ModerationError extends DefaultError {
    public override type = "Request";
    public result: IModerationResult;

    private static _getMessageFromResult(result: IModerationResult): string {
        return "Content has been flagged for moderation.";
    }

    constructor(result: IModerationResult) {
        super(ModerationError._getMessageFromResult(result));
        this.result = result;
    }
}
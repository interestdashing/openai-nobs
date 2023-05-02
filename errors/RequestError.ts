import { DefaultError } from "./DefaultError";

export class RequestError extends DefaultError {
    public override type = "Request";
}

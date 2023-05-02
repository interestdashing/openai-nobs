import { DefaultError } from "./DefaultError";

export class ResponseError extends DefaultError {
    public override type = "Response";
}

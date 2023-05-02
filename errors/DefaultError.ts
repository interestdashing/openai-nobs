export class DefaultError {
    public type: string = "Error";

    public message: string;

    constructor(message: string) {
        this.message = message;
    }

    public toString() {
        return `${this.type}: ${this.message}`;
    }
}
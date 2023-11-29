// Customizing the Error class for custom errors
export class ApplicationError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
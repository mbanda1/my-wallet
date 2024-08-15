export type ErrorModel = { message: string, status: number, stack?: string }

export class APIError extends Error {
    public status: number;

    constructor({ message, status, stack }: ErrorModel ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.stack = stack;
    }
}
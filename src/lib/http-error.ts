export class APIError extends Error {
    public status: number;

    constructor({ message, status, stack }: { message: string, status: number, stack?: string }) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.stack = stack;
    }
}
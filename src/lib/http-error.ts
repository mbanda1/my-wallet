export const APIError = class extends Error {
    constructor({message, stack}: {message:string, stack?:string}) {
        super(message!)
        this.name = this.constructor.name
        this.stack = stack
    }
}
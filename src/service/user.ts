import logger from "../logger";
import { User } from "../mongoose/models";

export const getUserById = async ({ id }: { id: string }) => {
    logger.info({ id }, `[SERVICE], Get user by id`)

    return User.findById(id)
}

import { getUserById } from "../db";
import logger from "../logger";

export const findUserById = async ({ id }: { id: string }) => {
    logger.info({ id }, `[SERVICE], Get user by id`)

    return getUserById({id})
}

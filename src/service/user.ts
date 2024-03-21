import { User } from "../mongoose/models";

export const getUserById = async ({id}: {id: string}) =>  await User.findById(id)

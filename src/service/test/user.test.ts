// @ts-nocheck
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import logger from "../../logger";
import { User } from "../../mongoose/models";
import { findUserById } from "../user";

jest.mock("../../logger", () => ({
  info: jest.fn(),
}));

jest.mock("../../mongoose/models", () => ({
  User: {
    findById: jest.fn(),
  },
}));

describe("[TEST] Get User ById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call logger.info with the correct message", async () => {
    const id = "123456";
    await findUserById({ id });
    expect(logger.info).toHaveBeenCalledWith({ id }, "[SERVICE], Get user by id");
  });

  it("should call User.findById with the correct id", async () => {
    const id = "123456";
    await findUserById({ id });
    expect(User.findById).toHaveBeenCalledWith(id);
  });

  it("should return the user object from User.findById", async () => {
    const id = "123456";
    const mockUser = { _id: id, name: "Nixon One" };

    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await findUserById({ id });
    expect(result).toEqual(mockUser);
  });
});

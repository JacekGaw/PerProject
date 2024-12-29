import { hashPassword, comparePasswords } from "../../src/utils/passwordUtils";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  genSaltSync: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("Password Hashing and Comparison", () => {
  describe("hashPassword", () => {
    it("should hash a password correctly", async () => {
      const plainPassword = "myPassword";
      const hashedPassword = "hashedPassword";
      bcrypt.genSaltSync.mockReturnValue("mockSalt");
      bcrypt.hash.mockResolvedValue(hashedPassword);
      process.env.HASH_SALT = "10";
      const result = await hashPassword(plainPassword);
      expect(result).toBe(hashedPassword);
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, "mockSalt");
    });
    it("should throw an error if hashing fails", async () => {
      const plainPassword = "myPassword";
      bcrypt.hash.mockRejectedValue(new Error("Hashing failed"));
      await expect(hashPassword(plainPassword)).rejects.toThrow(
        "Hashing failed"
      );
    });
  });

  describe("comparePasswords", () => {
    it("should return true if passwords match", async () => {
      const plainPassword = "myPassword";
      const hashedPassword = "hashedPassword";
      bcrypt.compare.mockResolvedValue(true);
      const result = await comparePasswords(plainPassword, hashedPassword);
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        hashedPassword
      );
    });

    it("should return false if passwords do not match", async () => {
      const plainPassword = "myPassword";
      const hashedPassword = "hashedPassword";
      bcrypt.compare.mockResolvedValue(false);
      const result = await comparePasswords(plainPassword, hashedPassword);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        hashedPassword
      );
    });

    it("should throw an error if comparison fails", async () => {
      const plainPassword = "myPassword";
      const hashedPassword = "hashedPassword";
      bcrypt.compare.mockRejectedValue(new Error("Comparison failed"));
      await expect(
        comparePasswords(plainPassword, hashedPassword)
      ).rejects.toThrow("Comparison failed");
    });
  });
});

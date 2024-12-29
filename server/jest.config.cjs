require('dotenv').config();

module.exports = {
  roots: ["<rootDir>/tests", "<rootDir>/src", "<rootDir>/dist"],
  
  modulePaths: [
  "<rootDir>/src"
  ],
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
  },
};

  
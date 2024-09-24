jest.mock("./src/utils/db");
jest.spyOn(console, "error").mockImplementation(() => {});

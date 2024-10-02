import { render, waitFor } from "@testing-library/react";
import useAxios from "axios-hooks";
import IndexPage from "./index";
import { type Mock } from "vitest";

vi.mock("axios-hooks");

describe("test index page", () => {
  it("should show user data", async () => {
    // mock user data
    (useAxios as unknown as Mock).mockReturnValue([
      {
        status: 200,
        error: null,
        data: {
          user: {
            id: 3,
            email: "test1@test.com",
            createdAt: "2024-10-01T13:25:27.565Z",
            updatedAt: "2024-10-01T13:25:27.565Z",
            iat: 1727853548,
          },
        },
      },
    ]);

    const screen = render(<IndexPage />);

    await waitFor(() => {
      expect(screen.getByText("ID : 3")).toBeInTheDocument();
      expect(screen.getByText("Email : test1@test.com")).toBeInTheDocument();
    });
  });

  it("should show error message when api error", async () => {
    // mock api error
    (useAxios as unknown as Mock).mockReturnValue([
      {
        status: 500,
        error: new Error("Internal Server Error"),
      },
    ]);

    const screen = render(<IndexPage />);

    await waitFor(() => {
      expect(screen.getByText("ไม่พบข้อมูล")).toBeInTheDocument();
    });
  });
});

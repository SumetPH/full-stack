import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./login.tsx";
import { type Mock } from "vitest";
import useAxios from "axios-hooks";
import { useNavigate } from "react-router-dom";

vi.mock("axios-hooks");
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  Navigate: vi.fn(),
}));

beforeAll(() => {
  window.alert = vi.fn();
  window.scrollTo = vi.fn();
});

beforeEach(() => {
  localStorage.clear();

  const mockNavigate = vi.fn();
  (useNavigate as Mock).mockReturnValue(mockNavigate);

  (useAxios as unknown as Mock).mockReturnValue([null, null]);
});

describe("test index page", () => {
  it("should render component", () => {
    const screen = render(<LoginPage />);

    // title
    expect(screen.getByText("Login Form")).toBeInTheDocument();
    // label
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    // input
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    // button
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("should validate form", async () => {
    const screen = render(<LoginPage />);

    fireEvent.click(screen.getByText("Login"));

    // validate error
    await waitFor(() => {
      expect(screen.getByText("รูปแบบอีเมลไม่ถูกต้อง")).toBeInTheDocument();
      expect(
        screen.getByText("รหัสผ่านต้องมากกว่า 6 ตัวอักษร")
      ).toBeInTheDocument();
    });
  });

  it("should submit form success", async () => {
    (useAxios as unknown as Mock).mockReturnValue([
      null,
      vi.fn().mockResolvedValue({
        status: 200,
        data: { token: "token" },
      }),
    ]);

    const screen = render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testtest" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Email")).toHaveValue("test@test.com");
      expect(screen.getByPlaceholderText("Password")).toHaveValue("testtest");
      expect(screen.getByText("Login Success")).toBeInTheDocument();
    });

    // fireEvent.click(screen.getByText("OK"));
    // await waitFor(() => {
    //   expect(mockNavigate).toHaveBeenCalledWith("/");
    // });
  });

  it("should submit form error", async () => {
    (useAxios as unknown as Mock).mockReturnValue([
      null,
      vi.fn().mockResolvedValue({ status: 500 }),
    ]);

    const screen = render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testtest" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Email")).toHaveValue("test@test.com");
      expect(screen.getByPlaceholderText("Password")).toHaveValue("testtest");
      expect(screen.getByText("Login Failed")).toBeInTheDocument();
    });
  });
});

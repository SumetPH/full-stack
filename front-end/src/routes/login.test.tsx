import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./login.tsx";
import { type Mock } from "vitest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

beforeAll(() => {
  window.alert = vi.fn();
  window.scrollTo = vi.fn();
});

// beforeEach(() => {
//   const mockNavigate = vi.fn();
//   (useNavigate as Mock).mockReturnValue(mockNavigate);
// });

describe("test index page", () => {
  test("render component", () => {
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

  test("validate form", async () => {
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

  test("submit form success", async () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (axios.post as Mock).mockReturnValue({ data: "test" });

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

    fireEvent.click(screen.getByText("OK"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("submit form error", async () => {
    (axios.post as Mock).mockRejectedValue(new Error("api error"));

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

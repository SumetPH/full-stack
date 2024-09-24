import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string | undefined;
  password: string | undefined;
};

const schema = z.object({
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร" }),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: undefined,
      password: undefined,
    },
  });

  const submit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.post("https://jsonplaceholder.typicode.com/posts", data);

      swal
        .fire({
          icon: "success",
          title: "Login Success",
        })
        .then(() => {
          navigate("/");
        });
    } catch (error) {
      console.error(error);
      swal.fire({
        icon: "error",
        title: "Login Failed",
      });
    }
  };

  return (
    <div className="container mx-auto ">
      <div className="flex justify-center p-10">
        <div className="w-full lg:w-1/2 shadow p-6 md:py-10 md:px-20">
          <section className="text-xl font-bold text-center mb-6">
            Login Form
          </section>
          <form onSubmit={form.handleSubmit(submit)}>
            <section className="mb-6">
              <label className="block font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                {...form.register("email")}
                className="w-full border rounded p-2"
                type="email"
                placeholder="Email"
              />
              {form.formState.errors.email && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </span>
              )}
            </section>
            <section className="mb-6">
              <label className="block font-medium mb-2" htmlFor="email">
                Password
              </label>
              <input
                {...form.register("password")}
                className="w-full border rounded p-2"
                type="password"
                placeholder="Password"
              />
              {form.formState.errors.password && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </span>
              )}
            </section>
            <section className="mb-6">
              <button
                className="w-full bg-blue-400 text-white p-2 rounded"
                type="submit"
              >
                Login
              </button>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

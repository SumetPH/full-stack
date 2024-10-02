import useAxios from "axios-hooks";

type User = {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  iat: number;
};

export default function IndexPage() {
  const [userRes] = useAxios<{ user: User }>({
    url: `${import.meta.env.VITE_APP_API}/auth/user`,
    method: "GET",
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">IndexPage</h1>
      {userRes.error ? (
        <section>ไม่พบข้อมูล</section>
      ) : (
        <div>
          <section>ID : {userRes.data?.user.id}</section>
          <section>Email : {userRes.data?.user.email}</section>
        </div>
      )}
    </div>
  );
}

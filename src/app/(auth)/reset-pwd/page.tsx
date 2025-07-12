import ResetPasswordPage from "../../../components/form/reset-pwd";
// import ResetPasswordPage from "@/components/form/reset-pwd";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

//   console.log("Token FE:", token);

  return (
    <div>
      {token ? (
        <ResetPasswordPage token={token} />
      ) : (
        <p className="text-red-500">Token is missing</p>
      )}
    </div>
  );
}

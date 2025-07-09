import VerifyPage from "@/components/verify";

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
        <VerifyPage token={token} />
      ) : (
        <p className="text-red-500">Token is missing</p>
      )}
    </div>
  );
}

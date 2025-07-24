import { Bounce, ToastContainer } from "react-toastify";


export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <div>
      { children }
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          draggable
          theme="dark"
          closeOnClick
          transition={Bounce}
        />

    </div>
  );
}

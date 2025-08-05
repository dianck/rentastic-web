import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import EditProfilePage from "@/components/form/profile";

export default async function Home() {

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <div className="container mx-auto  items-center justify-between px-4 md:px-6">
                <EditProfilePage />
            </div>
        </main>
        <Footer />
      </div>
  );
}

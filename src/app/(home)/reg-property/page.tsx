import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import EditPropertyPage from "@/components/form/property";

export default async function Home() {

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <div className="container mx-auto  items-center justify-between px-4 md:px-6">
                <EditPropertyPage />
            </div>
        </main>
        <Footer />
      </div>
  );
}

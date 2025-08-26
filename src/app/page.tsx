import { Header } from "@/components/header";
import { ClarityApp } from "@/components/clarity-app";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ClarityApp />
      </main>
    </div>
  );
}

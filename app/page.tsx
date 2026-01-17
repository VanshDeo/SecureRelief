import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Campaigns } from "@/components/landing/Campaigns";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Stats />
      <HowItWorks />
      <Campaigns />
    </div>
  );
}

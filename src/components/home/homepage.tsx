"use client";

import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";

export function Homepage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import HeroSectionImg from "../../public/production-line-98.png";

export const HeroSection = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            {/* Main headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Put <span className="text-primary">inventory</span> first
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Smart, user-friendly and efficient - turn inventory chaos into
              profit and streamline your daily operations with your own branded
              system.
            </p>

            {/* Email signup */}
            <div className="flex gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter work email"
                className="flex-1 px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <Button className="px-6 py-3">Book a demo</Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-foreground">85.2%</div>
                <div className="text-sm text-muted-foreground">
                  Average cost reduction
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">~15k</div>
                <div className="text-sm text-muted-foreground">
                  Items tracked daily
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-4">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <Star className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-foreground">4.5</span>
              <span className="text-sm text-muted-foreground">
                Average user rating
              </span>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src={HeroSectionImg}
                alt="Inventory Management System Illustration"
                width={600}
                height={500}
                className="w-full max-w-lg h-auto"
                priority
              />

              {/* Floating elements */}
              <div className="absolute top-8 left-4 bg-card shadow-lg rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">
                    Stock Alert
                  </span>
                </div>
              </div>

              <div className="absolute bottom-12 right-4 bg-card shadow-lg rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">
                    Team Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return <HeroSection />;
}

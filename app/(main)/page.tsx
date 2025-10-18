import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import HeroTitle from "@/components/ui/herotitle";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Tranformtext from "@/components/ui/transform-text";
import { RouteURL } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  Download,
  Share,
  Zap,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[calc(100dvh-var(--header-height))] grid place-items-center">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#d4d4d4_1px,transparent_2px)]",
            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div> */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-0% to-10% from-background"></div>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background from-0% to-10%"></div>
        <div className="z-10 max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <Badge variant="default" className="p-1.5">
              <Sparkles className="size-4" />
              AI-Powered Resume Builder
            </Badge>
            <HeroTitle />

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create stunning CV, portfolios, and resumes that adapt to any job.
              Let AI optimize your content for maximum impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href={RouteURL.SIGNUP}>
                <Button size="lg" className="group text-base sm:text-lg">
                  <span>Start Building Free</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform size-auto" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-[calc(100dvh-var(--header-height))] grid place-items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <div className="flex flex-col items-center justify-center space-y-2 mb-6">
              <h2 className="text-foreground ">Everything you need to </h2>
              <p className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent font-extrabold text-5xl lg:text-7xl italic">
                stand out
              </p>
            </div>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From AI-powered content optimization to instant PDF generation,
              Zapply has all the tools to accelerate your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:grid-rows-2">
            <div className="lg:row-span-2">
              <FeatureCard
                icon={<Sparkles className="w-6 h-6 text-foreground" />}
                title="AI Resume Optimization"
                description="Paste any job description and watch AI fine-tune your resume to match perfectly, increasing your chances of getting noticed. Our advanced AI analyzes job requirements, keywords, and industry standards to optimize your content for maximum impact and ATS compatibility."
                gradientFrom="from-primary"
                gradientTo="to-chart-2"
              />
            </div>

            <FeatureCard
              icon={<Download className="w-6 h-6 text-foreground" />}
              title="Instant PDF Generation"
              description="Generate professional PDF resumes and CV instantly with multiple templates designed by career experts."
              gradientFrom="from-chart-3"
              gradientTo="to-chart-4"
            />

            <FeatureCard
              icon={<Share className="w-6 h-6 text-foreground" />}
              title="Public Portfolio"
              description="Create stunning online portfolios and CV that you can share with a single link. Perfect for networking and applications."
              gradientFrom="from-chart-5"
              gradientTo="to-primary"
            />

            <FeatureCard
              icon={<Zap className="w-6 h-6 text-foreground" />}
              title="Lightning Fast"
              description="Build and customize your resume in minutes, not hours. Our intuitive interface makes professional design accessible to everyone."
              gradientFrom="from-chart-2"
              gradientTo="to-chart-3"
            />

            <FeatureCard
              icon={<Users className="w-6 h-6 text-foreground" />}
              title="ATS Friendly"
              description="All our templates are optimized for Applicant Tracking Systems, ensuring your resume gets past the initial screening."
              gradientFrom="from-chart-4"
              gradientTo="to-chart-5"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 mt-12 grid place-items-center bg-gradient-to-r from-primary/5 via-chart-2/5 to-chart-3/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to <Tranformtext />
            your career?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers
            with AI-powered resumes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 group"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever plan
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 p-0">
          <TextHoverEffect text="zapply" />
        </div>
      </footer>
    </>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
}: FeatureCardProps) => {
  return (
    <Card className="relative h-full">
      <GlowingEffect
        blur={0}
        borderWidth={1.5}
        spread={80}
        glow={true}
        disabled={false}
        proximity={32}
        inactiveZone={0}
      />
      <CardHeader>
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-1 flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className={`font-semibold text-foreground`}>{title}</h3>
            <p className={`text-muted-foreground leading-relaxed`}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

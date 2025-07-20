"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Video,
  Heart,
  Share2,
  MessageCircle,
  Globe,
  Shield,
  Smartphone,
  Users,
  Zap,
  Eye,
} from "lucide-react";
import Link from "next/link";

export function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: "Simple Video Sharing",
      description:
        "Upload your moments directly. No watermarks, no complicated editing tools.",
      highlight: "Just pure sharing",
    },
    {
      icon: Heart,
      title: "Meaningful Interactions",
      description:
        "Real likes and comments from people who actually watched your content.",
      highlight: "Authentic engagement",
    },
    {
      icon: Users,
      title: "Creator-First",
      description: "Built by creators, for creators. Your content stays yours.",
      highlight: "No hidden algorithms",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Share with friends, family, or the world. You control who sees what.",
      highlight: "Your choice, your audience",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Creators Choose ReelsPro
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We built ReelsPro differently. No dark patterns, no exploitation,
            just a platform that helps you share your creativity with the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      {feature.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-gray-700 border-gray-300"
                    >
                      {feature.highlight}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Real Numbers, Real Growth
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our community is growing because we focus on what matters:
              authentic content and genuine connections.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">99%</div>
              <div className="text-gray-600">Creator Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">2.5M</div>
              <div className="text-gray-600">Videos Uploaded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">45%</div>
              <div className="text-gray-600">Monthly Growth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Creator Support</div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
            "Finally, a platform that doesn't feel like it's working against me.
            ReelsPro just lets me share my cooking videos without the stress."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Sarah Chen</div>
              <div className="text-purple-200">Food Creator, 50K followers</div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Join Sarah and 10K+ creators
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  Sparkles,
  Share2,
  Heart,
  MessageCircle,
  Zap,
  Globe,
  Shield,
  Smartphone,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: "HD Video Quality",
      description:
        "Upload and stream videos in crystal clear HD quality with automatic optimization.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Editing",
      description:
        "Smart filters and effects powered by AI to make your content stand out.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description:
        "Share your creations across platforms with one click and reach wider audiences.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Heart,
      title: "Engagement Tools",
      description:
        "Like, comment, and interact with your favorite creators and build your community.",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Experience blazing fast uploads, streaming, and interactions with optimized performance.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with creators and audiences from every corner of the world.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Amazing Content
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ReelsPro provides all the tools and features you need to create,
            share, and grow your audience with stunning short-form videos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Smartphone className="w-8 h-8" />
              <Shield className="w-8 h-8" />
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of creators who are already using ReelsPro to share
              their stories and grow their audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105">
                Start Creating Today
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

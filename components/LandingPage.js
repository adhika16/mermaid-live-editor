'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { animate } from 'animejs';
import { stagger } from 'animejs/utils';

export default function LandingPage() {
  useEffect(() => {
    // Animate hero title words
    animate('.hero-title-word', {
      opacity: { to: 1 },
      translateY: { to: 0 },
      duration: 700,
      delay: stagger(100),
      ease: 'easeOutCubic',
    });

    // Animate hero description
    animate('.hero-description', {
      opacity: { to: 1 },
      translateY: { to: 0 },
      duration: 700,
      delay: 400,
      ease: 'easeOutCubic',
    });

    // Animate CTA buttons
    animate('.hero-button', {
      opacity: { to: 1 },
      translateX: { to: 0 },
      duration: 700,
      delay: stagger(120, { start: 500 }),
      ease: 'easeOutCubic',
    });

    // Animate accent line
    animate('.accent-line', {
      width: { to: 100, from: 0 },
      duration: 600,
      delay: 300,
      ease: 'easeOutCubic',
    });

    // Animate geometric accent
    animate('.geo-accent', {
      opacity: { to: 1 },
      scale: { to: 1 },
      rotate: { to: 0 },
      duration: 1000,
      delay: 700,
      ease: 'easeOutCubic',
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-base-100 flex flex-col">
      {/* Swiss Style Hero Section */}
      <section className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-20 py-20 md:py-0">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Content - Swiss Typography Focus */}
            <div className="space-y-10">
              {/* Title - Large, Sans-serif, Structured */}
              <div className="space-y-4">
                <h1 className="space-y-2">
                  <div
                    className="hero-title-word text-6xl lg:text-7xl font-black tracking-tight leading-none"
                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                  >
                    Create
                  </div>
                  <div
                    className="hero-title-word text-6xl lg:text-7xl font-black tracking-tight leading-none"
                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                  >
                    Diagrams
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div
                      className="hero-title-word text-6xl lg:text-7xl font-black tracking-tight leading-none"
                      style={{ opacity: 0, transform: 'translateY(20px)' }}
                    >
                      with
                    </div>
                    <div
                      className="accent-line h-1 bg-primary"
                      style={{ width: 0 }}
                    ></div>
                  </div>
                  <div
                    className="hero-title-word text-6xl lg:text-7xl font-black text-primary tracking-tight leading-none"
                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                  >
                    Precision
                  </div>
                </h1>
              </div>

              {/* Divider */}
              <div className="h-0.5 w-12 bg-primary"></div>

              {/* Description - Swiss Rationality */}
              <p
                className="hero-description text-base lg:text-lg font-light leading-relaxed max-w-md"
                style={{ opacity: 0, transform: 'translateY(20px)' }}
              >
                An open-source Mermaid diagram editor built with clarity and purpose. Create flowcharts, sequences, and Gantt charts with perfect control.
              </p>

              {/* CTA Buttons - Minimal Swiss Style */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  href="/editor"
                  className="hero-button flex items-center justify-center px-8 py-3 bg-primary text-primary-content font-semibold text-base border-2 border-primary transition-all duration-200 hover:shadow-lg active:scale-95"
                  style={{ opacity: 0, transform: 'translateX(-20px)' }}
                >
                  Start Creating
                </Link>
                <a
                  href="https://github.com/adhika16/mermaid-live-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-button flex items-center justify-center px-8 py-3 bg-base-100 text-base-content font-semibold text-base border-2 border-base-300 transition-all duration-200 hover:border-primary hover:shadow-lg active:scale-95"
                  style={{ opacity: 0, transform: 'translateX(-20px)' }}
                >
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right Side - Geometric Accent */}
            <div className="relative h-80 lg:h-96 hidden lg:flex items-center justify-center">
              {/* Main geometric shape - Swiss minimalism */}
              <div
                className="geo-accent absolute inset-0 flex items-center justify-center"
                style={{ opacity: 0, transform: 'scale(0.9) rotate(-10deg)' }}
              >
                {/* Background grid suggestion */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-30"
                  viewBox="0 0 400 400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#grid)" />
                </svg>

                {/* Geometric diagram - Swiss precision */}
                <svg
                  className="relative w-64 h-64 z-10"
                  viewBox="0 0 300 300"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Large circle */}
                  <circle cx="150" cy="150" r="80" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40" />

                  {/* Squares - Swiss geometric precision */}
                  <g className="text-primary">
                    <rect x="80" y="80" width="140" height="140" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect x="100" y="100" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  </g>

                  {/* Corner accents */}
                  <g className="text-primary opacity-50">
                    <line x1="50" y1="150" x2="100" y2="150" stroke="currentColor" strokeWidth="2" />
                    <line x1="200" y1="150" x2="250" y2="150" stroke="currentColor" strokeWidth="2" />
                    <line x1="150" y1="50" x2="150" y2="100" stroke="currentColor" strokeWidth="2" />
                    <line x1="150" y1="200" x2="150" y2="250" stroke="currentColor" strokeWidth="2" />
                  </g>

                  {/* Center point - precision symbol */}
                  <circle cx="150" cy="150" r="4" fill="currentColor" className="text-primary" />

                  {/* Info nodes */}
                  <g className="text-secondary opacity-70">
                    <rect x="120" y="60" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" rx="2" />
                    <rect x="120" y="200" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" rx="2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Swiss Grid Footer Accent */}
      <div className="border-t border-base-300 px-8 sm:px-12 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-sm opacity-50">
          <div className="space-y-1">
            <p className="font-semibold text-base-content">Open Source</p>
            <p>Built for creators and developers</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-base-content">Theme Aware</p>
            <p>Respects your system settings</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-base-content">Zero Setup</p>
            <p>Start creating immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
}

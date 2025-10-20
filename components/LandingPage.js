'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { animate } from 'animejs';
import { stagger } from 'animejs/utils';

export default function LandingPage() {
  useEffect(() => {
    // Animate hero title
    animate('.hero-title', {
      opacity: { to: 1 },
      translateY: { to: 0 },
      duration: 800,
      ease: 'outQuad',
    });

    // Animate hero subtitle
    animate('.hero-subtitle', {
      opacity: { to: 1 },
      translateY: { to: 0 },
      duration: 800,
      delay: 200,
      ease: 'outQuad',
    });

    // Animate hero description
    animate('.hero-description', {
      opacity: { to: 1 },
      translateY: { to: 0 },
      duration: 800,
      delay: 400,
      ease: 'outQuad',
    });

    // Animate hero buttons
    animate('.hero-button', {
      opacity: { to: 1 },
      translateY: { to: 0 },
      duration: 800,
      delay: stagger(150, { start: 500 }),
      ease: 'outQuad',
    });

    // Animate hero graphic
    animate('.hero-graphic', {
      opacity: { to: 1 },
      scale: { to: 1 },
      duration: 1000,
      delay: 600,
      ease: 'outQuad',
    });
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-0">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <h1
                className="hero-title text-4xl md:text-6xl font-bold"
                style={{ opacity: 0, transform: 'translateY(30px)' }}
              >
                Visualize Your
                <span className="block text-primary">Ideas Instantly</span>
              </h1>

              <p
                className="hero-description text-lg opacity-75 leading-relaxed"
                style={{ opacity: 0, transform: 'translateY(30px)' }}
              >
                A simple, powerful, and open-source Mermaid diagram editor. Create flowcharts, sequence diagrams, Gantt charts, and more in seconds.
              </p>

              <div className="flex gap-3 pt-4">
                <Link
                  href="/editor"
                  className="hero-button btn btn-primary"
                  style={{ opacity: 0, transform: 'translateY(30px)' }}
                >
                  Start Editing
                </Link>
                <a
                  href="https://github.com/adhika16/mermaid-live-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-button btn btn-outline"
                  style={{ opacity: 0, transform: 'translateY(30px)' }}
                >
                  GitHub ⭐
                </a>
              </div>
            </div>

            {/* Right graphic */}
            <div className="relative h-64 md:h-96">
              <div
                className="hero-graphic absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden"
                style={{ opacity: 0, transform: 'scale(0.8)' }}
              >
                <svg
                  className="w-3/4 h-3/4"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Flowchart nodes */}
                  <rect
                    x="20"
                    y="20"
                    width="60"
                    height="40"
                    rx="5"
                    fill="white"
                    opacity="0.9"
                  />
                  <text
                    x="50"
                    y="45"
                    textAnchor="middle"
                    fill="#1e40af"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    Start
                  </text>

                  {/* Arrow */}
                  <line
                    x1="50"
                    y1="60"
                    x2="50"
                    y2="80"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />

                  {/* Middle node */}
                  <circle
                    cx="50"
                    cy="110"
                    r="20"
                    fill="white"
                    opacity="0.9"
                  />

                  {/* Arrow */}
                  <line
                    x1="50"
                    y1="130"
                    x2="50"
                    y2="150"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />

                  {/* End node */}
                  <rect
                    x="20"
                    y="150"
                    width="60"
                    height="40"
                    rx="5"
                    fill="white"
                    opacity="0.9"
                  />
                  <text
                    x="50"
                    y="175"
                    textAnchor="middle"
                    fill="#1e40af"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    End
                  </text>

                  {/* Decorative circles */}
                  <circle
                    cx="140"
                    cy="60"
                    r="15"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r="15"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

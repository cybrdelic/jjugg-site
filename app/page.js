"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import {
  Sun, Moon, ChevronRight, Github, Twitter, Instagram, Facebook,
  Check, Globe, FileText, Layout, ArrowRight, Zap, BarChart3,
  Code, Mail, Shield, Terminal, Database, Server,
  Sparkles, UserCircle2, Laptop, MonitorSmartphone, Package, Workflow as WorkflowIcon,
  Cpu, Bot, Brain, Key, LockIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import * as THREE from 'three';
import { Chart, registerables } from 'chart.js';
import { cn } from "@/lib/utils";

// Import custom UI components
import { CodeBlock } from '@/app/components/ui/code-block';
import { FeatureCard } from '@/app/components/ui/feature-card';
import { SectionHeader } from '@/app/components/ui/section-header';
import { HeroAnimation } from "@/app/components/ui/hero-animation"
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Workflow } from '@/app/components/ui/workflow';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import {
  Button
} from "@/app/components/ui/button";

import {
  Input
} from "@/app/components/ui/input";

// Register Chart.js components
Chart.register(...registerables);

// Constants
const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-indigo-500" />,
    title: "Automatic Tracking with Userscripts",
    description: "Browser extensions capture application data as you apply on any job site and store it in localStorage until sync."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
    title: "Email Integration & Status Updates",
    description: "Reads your emails to automatically track application statuses and interview requests using LLMs."
  },
  {
    icon: <Github className="w-6 h-6 text-purple-500" />,
    title: "Interview Preparation Assistant",
    description: "Automatically generates notes, practice questions, and resources based on the job description."
  },
  {
    icon: <Layout className="w-6 h-6 text-emerald-500" />,
    title: "Unified Dashboard Experience",
    description: "Self-hosted solution that syncs data from userscripts to your personal database for complete privacy."
  }
];

const SCREENSHOTS = [
  {
    image: "/dashboard.jpg",
    title: "Unified Dashboard",
    description: "All your applications synced from userscripts in one secure place"
  },
  {
    image: "/applications_grid.jpg",
    title: "Browser Extension Capture",
    description: "Data automatically captured as you apply on job sites"
  },
  {
    image: "/screenshot3.jpg",
    title: "Email Status Tracking",
    description: "AI-powered status updates from your inbox"
  },
  {
    image: "/dashboard.jpg", // Placeholder - you may want to add a real image
    title: "Interview Preparation",
    description: "AI-generated notes and practice questions for each application"
  }
];

const CONTRIBUTIONS = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Userscript Development",
    description: "Help expand our collection of job site-specific userscripts to capture application data."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Email Parser Improvements",
    description: "Enhance our email parsing models to better extract application statuses and interview details."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "LLM Integration",
    description: "Develop better prompts and AI integration for interview preparation and job search optimization."
  },
  {
    icon: <Github className="w-6 h-6" />,
    title: "Self-Hosting Enhancements",
    description: "Contribute to making jjugg easier to deploy and configure on personal servers."
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(null);
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const heroRef = useRef(null);

  // Define spring config
  const springConfig = { damping: 40, stiffness: 100 };

  // Define all motion hooks here
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const mouseXSpring = useSpring(0, springConfig);
  const mouseYSpring = useSpring(0, springConfig);

  // Define gradient here using motion template
  const gradient = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseXSpring}px ${mouseYSpring}px,
      rgba(99, 102, 241, 0.15),
      transparent 80%
    )
  `;

  useEffect(() => {
    setMounted(true);

    // Import fonts in the client component
    const loadFonts = async () => {
      if (typeof window !== 'undefined') {
        await Promise.all([
          document.fonts.load('1em "Inter"'),
          document.fonts.load('1em "Outfit"')
        ]);
      }
    };

    loadFonts();
  }, []);

  // Mouse position tracking
  useEffect(() => {
    if (!mounted) return;

    const updateMousePosition = (e) => {
      const { clientX, clientY } = e;
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        setMousePosition({ x, y });
        // We're now using the mouseXSpring that's defined at the top level
        mouseXSpring.set(clientX);
        mouseYSpring.set(clientY);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Initialize shader and chart when component is mounted
  useEffect(() => {
    if (!mounted) return;

    // Initialize shader background
    if (canvasRef.current) {
      initShaderBackground();
    }

    // Initialize chart
    if (chartRef.current) {
      initChart();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [mounted]);

  // Update shader colors when theme changes
  useEffect(() => {
    if (!mounted) return;

    // Update chart colors
    if (chartInstance.current) {
      updateChartColors();
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const openLightbox = (screenshot) => {
    setCurrentScreenshot(screenshot);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const initShaderBackground = () => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_colorA: { value: new THREE.Color(theme === 'dark' ? '#0f172a' : '#f8fafc') },
      u_colorB: { value: new THREE.Color(theme === 'dark' ? '#020617' : '#f1f5f9') }
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec3 u_colorA;
      uniform vec3 u_colorB;

      // Simplex Noise Function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse / u_resolution.xy;

        // Noise and distortion
        float noise = snoise(uv * 3.0 + u_time * 0.1);
        float distort = smoothstep(0.0, 1.0, distance(uv, mouse) * 2.0);

        // Gradient with mouse interaction
        vec3 color = mix(u_colorA, u_colorB, uv.y + noise * 0.1);
        color += (1.0 - distort) * 0.2;

        // Subtle glow effect
        float glow = pow(1.0 - distance(uv, mouse), 4.0) * 0.5;
        color += glow * u_colorA;

        gl_FragColor = vec4(color, 0.9 - noise * 0.1);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Mouse Interaction
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      uniforms.u_mouse.value.set(mouseX, window.innerHeight - mouseY);
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.u_time.value += 0.05;
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Update colors when theme changes
    const updateColors = () => {
      uniforms.u_colorA.value = new THREE.Color(theme === 'dark' ? '#0f172a' : '#f8fafc');
      uniforms.u_colorB.value = new THREE.Color(theme === 'dark' ? '#020617' : '#f1f5f9');
    };

    // Call updateColors initially and when theme changes
    updateColors();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animate);
    };
  };

  const initChart = () => {
    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Applications', 'Responses', 'Interviews', 'Offers', 'Accepted'],
        datasets: [{
          label: 'Automatically Tracked',
          data: [42, 28, 15, 5, 1],
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)', // Indigo - Applications
            'rgba(59, 130, 246, 0.7)', // Blue - Responses
            'rgba(168, 85, 247, 0.7)', // Purple - Interviews
            'rgba(236, 72, 153, 0.7)', // Pink - Offers
            'rgba(16, 185, 129, 0.7)'  // Green - Accepted
          ],
          borderColor: theme === 'dark' ? '#333333' : '#dddddd',
          borderWidth: 1
        },
        {
          label: 'Without Automation',
          data: [25, 12, 8, 3, 1],
          backgroundColor: [
            'rgba(99, 102, 241, 0.3)', // Indigo - Applications
            'rgba(59, 130, 246, 0.3)', // Blue - Responses
            'rgba(168, 85, 247, 0.3)', // Purple - Interviews
            'rgba(236, 72, 153, 0.3)', // Pink - Offers
            'rgba(16, 185, 129, 0.3)'  // Green - Accepted
          ],
          borderColor: theme === 'dark' ? '#333333' : '#dddddd',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: theme === 'dark' ? '#cccccc' : '#333333',
              font: {
                family: "'Inter', sans-serif" // Apply Inter font to chart labels
              }
            },
            grid: {
              color: theme === 'dark' ? '#333333' : '#eeeeee'
            }
          },
          x: {
            ticks: {
              color: theme === 'dark' ? '#cccccc' : '#333333',
              font: {
                family: "'Inter', sans-serif" // Apply Inter font to chart labels
              }
            },
            grid: {
              color: theme === 'dark' ? '#333333' : '#eeeeee'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: theme === 'dark' ? '#ffffff' : '#000000',
              font: {
                family: "'Inter', sans-serif" // Apply Inter font to chart legend
              }
            }
          },
          tooltip: {
            titleFont: {
              family: "'Inter', sans-serif"
            },
            bodyFont: {
              family: "'Inter', sans-serif"
            },
            footerFont: {
              family: "'Inter', sans-serif"
            }
          }
        }
      }
    });
  };

  const updateChartColors = () => {
    if (!chartInstance.current) return;

    chartInstance.current.options.scales.y.ticks.color = theme === 'dark' ? '#cccccc' : '#333333';
    chartInstance.current.options.scales.x.ticks.color = theme === 'dark' ? '#cccccc' : '#333333';
    chartInstance.current.options.scales.y.grid.color = theme === 'dark' ? '#333333' : '#eeeeee';
    chartInstance.current.options.scales.x.grid.color = theme === 'dark' ? '#333333' : '#eeeeee';
    chartInstance.current.options.plugins.legend.labels.color = theme === 'dark' ? '#ffffff' : '#000000';

    chartInstance.current.update();
  };

  if (!mounted) {
    return null;
  }

  // Motion variants for animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 50
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 90
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 90
      }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 50
      }
    }
  };


  return (
    <div className={`min-h-screen transition-colors duration-300 font-inter ${theme === "dark" ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      {/* Shader Background Canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10"></canvas>

      {/* Mouse gradient follower */}
      <motion.div
        className="fixed inset-0 z-[-5] pointer-events-none"
        style={{ background: gradient }}
      />

      {/* Theme Toggle Button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={toggleTheme}
        className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-3 py-2 text-sm rounded-full font-inter border shadow-lg backdrop-blur-md
        ${theme === "dark" ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white/60"} transition-all hover:scale-105 focus:outline-primary focus:outline-offset-2 focus:outline-2`}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </motion.button>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full py-6 z-40 backdrop-blur-md border-b transition-colors duration-300
      ${theme === "dark" ? "border-slate-800/60 bg-slate-950/60" : "border-slate-200/60 bg-white/60"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.a
            href="#"
            className="text-3xl font-bold font-outfit tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500">
              jjugg
            </span>
          </motion.a>
          <div className={`hidden md:flex space-x-8 font-inter text-sm`}>
            {["how-it-works", "features", "installation", "screenshots", "analytics-demo", "community-contributions", "cta"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300
                ${theme === "dark" ? "text-slate-400 hover:text-white after:bg-indigo-500" : "text-slate-600 hover:text-slate-900 after:bg-indigo-500"}`}
              >
                {item === "how-it-works" ? "How It Works" :
                  item === "analytics-demo" ? "Analytics" :
                    item === "community-contributions" ? "Community" :
                      item === "installation" ? "Install" :
                        item === "cta" ? "Get Started" :
                          item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.a>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button className="hidden md:flex font-inter rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl hover:translate-y-[-2px]">
              Get Started
            </Button>
          </motion.div>
          <button
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${theme === "dark" ? "bg-slate-950/95" : "bg-white/95"} backdrop-blur-md`}
            >
              <div className="px-4 py-4 space-y-4 font-inter text-sm">
                <a href="#how-it-works" className="block py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#features" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#installation" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Install</a>
                <a href="#screenshots" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Screenshots</a>
                <a href="#analytics-demo" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Analytics</a>
                <a href="#community-contributions" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Community</a>
                <a href="#cta" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Get Started</a>
                <Button className="w-full font-inter rounded-full mt-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" onClick={() => setMobileMenuOpen(false)}>
                  <Terminal className="w-4 h-4 mr-2" />
                  npm install -g jjugg-cli
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section
        ref={heroRef}
        id="hero"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-16 relative overflow-hidden"
      >
        <motion.div
          className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Left Column: Headline & Call-to-Action */}
          <div>
            <motion.div className="space-y-8">
              <motion.div variants={fadeIn}>
                <span className="inline-block px-3 py-1 text-xs font-semibold font-inter tracking-wider uppercase rounded-full bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                  Job Search Reinvented
                </span>
              </motion.div>

              <motion.h2
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold font-outfit tracking-tight"
              >
                Ready to <span className="text-indigo-500">Automate</span> Your Job Search?
              </motion.h2>

              <motion.p
                variants={fadeIn}
                className="text-xl max-w-lg mt-6 font-inter text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                Join the open-source movement revolutionizing job applications. No more manual tracking—our userscripts capture data as you apply, email parsers monitor status changes, and AI prepares you for interviews.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-wrap gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="font-inter rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group"
                >
                  <a href="#installation">
                    <span className="mr-2">$</span> npm install -g jjugg-cli
                    <Code className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-inter rounded-full dark:hover:bg-slate-800 hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <a href="#features">Explore Features</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Product Preview Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <HeroAnimation />
            {/* Optional decorative elements can be added here */}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <span className="text-sm font-inter dark:text-slate-500 text-slate-400">
            Scroll to explore
          </span>
          <motion.div
            className="mt-2 w-6 h-10 rounded-full border-2 dark:border-slate-700 border-slate-300 flex justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 rounded-full dark:bg-slate-500 bg-slate-400"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Automate Your Job Search"
            title="How jjugg Works"
            description="A seamless end-to-end solution that automates job tracking from application to interview."
            theme={theme}
          />

          <div className="grid lg:grid-cols-2 gap-12 mt-16">
            {/* Left side: workflow visualization */}
            <div>
              <Workflow theme={theme} />
            </div>

            {/* Right side: Features */}
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={<Database className="w-6 h-6 text-indigo-500" />}
                  title="Capture"
                  description="Browser extensions detect and save job applications as you apply."
                  badge="UserScripts"
                  badgeVariant="secondary"
                  theme={theme}
                  index={0}
                />

                <FeatureCard
                  icon={<Database className="w-6 h-6 text-blue-500" />}
                  title="Sync"
                  description="Data from browser localStorage syncs to your local database."
                  badge="Self-Hosted"
                  badgeVariant="secondary"
                  theme={theme}
                  index={1}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={<Mail className="w-6 h-6 text-purple-500" />}
                  title="Track"
                  description="Email parsers detect status changes and interview invites automatically."
                  badge="AI-Powered"
                  badgeVariant="secondary"
                  theme={theme}
                  index={2}
                />

                <FeatureCard
                  icon={<Sparkles className="w-6 h-6 text-green-500" />}
                  title="Prepare"
                  description="LLMs generate personalized interview questions and preparation notes."
                  badge="GPT-4"
                  badgeVariant="secondary"
                  theme={theme}
                  index={3}
                />
              </div>


            </div>
          </div>

          {/* Key benefits */}
          <div className="mt-20">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <LockIcon className="w-5 h-5" />,
                  title: "Privacy First",
                  description: "Your data stays on your machine. No cloud storage, no third-party access.",
                  color: "indigo"
                },
                {
                  icon: <Terminal className="w-5 h-5" />,
                  title: "Open Source",
                  description: "Fully open-source codebase you can audit, modify and extend.",
                  color: "blue"
                },
                {
                  icon: <Cpu className="w-5 h-5" />,
                  title: "Low Resource",
                  description: "Minimal CPU and memory usage, even when tracking hundreds of applications.",
                  color: "purple"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "p-6 rounded-xl border backdrop-blur-sm flex items-start gap-4",
                    theme === "dark"
                      ? "bg-slate-900/40 border-slate-800"
                      : "bg-white/40 border-slate-200"
                  )}
                >
                  <div className={cn(
                    "rounded-lg p-2.5 mt-1",
                    benefit.color === "indigo" && theme === "dark" ? "bg-indigo-500/10 text-indigo-400" : "",
                    benefit.color === "blue" && theme === "dark" ? "bg-blue-500/10 text-blue-400" : "",
                    benefit.color === "purple" && theme === "dark" ? "bg-purple-500/10 text-purple-400" : "",
                    benefit.color === "indigo" && theme !== "dark" ? "bg-indigo-50 text-indigo-500" : "",
                    benefit.color === "blue" && theme !== "dark" ? "bg-blue-50 text-blue-500" : "",
                    benefit.color === "purple" && theme !== "dark" ? "bg-purple-50 text-purple-500" : ""
                  )}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold font-outfit mb-1",
                      theme === "dark" ? "text-white" : "text-slate-900"
                    )}>
                      {benefit.title}
                    </h3>
                    <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="features">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Core Features"
            title="Everything You Need to Land Your Dream Job"
            description="jjugg combines the best technologies to make your job search seamless and stress-free."
            theme={theme}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                theme={theme}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className={cn(
        "py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden",
        theme === "dark" ? "bg-gradient-to-b from-slate-950 to-slate-900" : "bg-gradient-to-b from-white to-slate-50"
      )} id="installation">
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            badge="Installation"
            title="Get Started in Minutes"
            description="Choose your preferred installation method and start automating your job search today."
            theme={theme}
          />

          {/* Installation Tabs */}
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="npm" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className={cn(
                  "grid grid-cols-4 w-full max-w-xl font-inter",
                  theme === "dark"
                    ? "bg-slate-800/80 text-slate-400"
                    : "bg-slate-100/80 text-slate-600"
                )}>
                  <TabsTrigger
                    value="npm"
                    className={cn(
                      "data-[state=active]:bg-indigo-500 data-[state=active]:text-white font-inter flex items-center gap-1.5",
                      theme === "dark"
                        ? "data-[state=active]:shadow-indigo-500/20 data-[state=active]:shadow-lg"
                        : "data-[state=active]:shadow-indigo-500/10"
                    )}
                  >
                    <Package className="h-4 w-4" />
                    npm
                  </TabsTrigger>
                  <TabsTrigger
                    value="cargo"
                    className={cn(
                      "data-[state=active]:bg-orange-500 data-[state=active]:text-white font-inter flex items-center gap-1.5",
                      theme === "dark"
                        ? "data-[state=active]:shadow-orange-500/20 data-[state=active]:shadow-lg"
                        : "data-[state=active]:shadow-orange-500/10"
                    )}
                  >
                    <Package className="h-4 w-4" />
                    cargo
                  </TabsTrigger>
                  <TabsTrigger
                    value="docker"
                    className={cn(
                      "data-[state=active]:bg-blue-500 data-[state=active]:text-white font-inter flex items-center gap-1.5",
                      theme === "dark"
                        ? "data-[state=active]:shadow-blue-500/20 data-[state=active]:shadow-lg"
                        : "data-[state=active]:shadow-blue-500/10"
                    )}
                  >
                    <Package className="h-4 w-4" />
                    docker
                  </TabsTrigger>
                  <TabsTrigger
                    value="source"
                    className={cn(
                      "data-[state=active]:bg-purple-500 data-[state=active]:text-white font-inter flex items-center gap-1.5",
                      theme === "dark"
                        ? "data-[state=active]:shadow-purple-500/20 data-[state=active]:shadow-lg"
                        : "data-[state=active]:shadow-purple-500/10"
                    )}
                  >
                    <Github className="h-4 w-4" />
                    source
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-8">
                <TabsContent value="npm" className="space-y-4">
                  <CodeBlock language="bash" className="shadow-lg">
                    {`# Install jjugg CLI globally
npm install -g jjugg-cli

# Install browser extension
npx jjugg install-extension

# Launch application
jjugg start

# Open dashboard in your browser
jjugg open`}
                  </CodeBlock>

                  <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 mt-4">
                    <h3 className="text-indigo-400 font-medium font-outfit text-sm flex items-center mb-2">
                      <Check className="w-4 h-4 mr-2" /> System Requirements
                    </h3>
                    <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
                      <li>Node.js 16 or newer</li>
                      <li>Chrome, Firefox, or Edge browser</li>
                      <li>300MB free disk space</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="cargo" className="space-y-4">
                  <CodeBlock language="bash" className="shadow-lg">
                    {`# Install jjugg from crates.io
cargo install jjugg

# Install browser extension
jjugg install-extension

# Launch application
jjugg start

# Open dashboard in your browser
jjugg open`}
                  </CodeBlock>

                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 mt-4">
                    <h3 className="text-orange-400 font-medium font-outfit text-sm flex items-center mb-2">
                      <Check className="w-4 h-4 mr-2" /> System Requirements
                    </h3>
                    <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
                      <li>Rust 1.65 or newer</li>
                      <li>Chrome, Firefox, or Edge browser</li>
                      <li>250MB free disk space</li>
                      <li>Optional: SQLite development libraries</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="docker" className="space-y-4">
                  <CodeBlock language="bash" className="shadow-lg">
                    {`# Pull the Docker image
docker pull jjugg/jjugg-app:latest

# Run the container
docker run -d \\
  --name jjugg \\
  -p 3000:3000 \\
  -v $(pwd)/jjugg-data:/app/data \\
  jjugg/jjugg-app:latest

# Access dashboard at http://localhost:3000

# Install browser extension separately
docker exec jjugg jjugg install-extension`}
                  </CodeBlock>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mt-4">
                    <h3 className="text-blue-400 font-medium font-outfit text-sm flex items-center mb-2">
                      <Check className="w-4 h-4 mr-2" /> System Requirements
                    </h3>
                    <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
                      <li>Docker Engine 20+ or Docker Desktop</li>
                      <li>Chrome, Firefox, or Edge browser</li>
                      <li>500MB free disk space for container</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="source" className="space-y-4">
                  <CodeBlock language="bash" className="shadow-lg">
                    {`# Clone the repository
git clone https://github.com/jjugg/jjugg.git

# Navigate to project directory
cd jjugg

# Install dependencies
npm install

# Build from source
npm run build

# Launch application
npm start

# Install extension
npm run extension:install`}
                  </CodeBlock>

                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 mt-4">
                    <h3 className="text-purple-400 font-medium font-outfit text-sm flex items-center mb-2">
                      <Check className="w-4 h-4 mr-2" /> System Requirements
                    </h3>
                    <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
                      <li>Node.js 16+ or Rust 1.65+</li>
                      <li>Git</li>
                      <li>Build tools for your platform</li>
                      <li>1GB free disk space for development</li>
                    </ul>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Terminal output simulation */}
            <motion.div
              className={cn(
                "mt-12 rounded-xl border backdrop-blur-md overflow-hidden",
                theme === "dark" ? "bg-black/50 border-slate-800" : "bg-black/80 border-slate-700"
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center px-4 py-2 border-b border-slate-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-slate-400 mx-auto font-inter">terminal</div>
              </div>

              <div className="p-4 max-h-64 overflow-y-auto font-inter text-sm text-slate-300">
                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex">
                    <span className="text-green-400 mr-2">$</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      npm install -g jjugg-cli
                    </motion.span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <span className="text-blue-400">added</span> 247 packages in 3.2s
                  </motion.div>

                  <div className="flex mt-2">
                    <span className="text-green-400 mr-2">$</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      jjugg start
                    </motion.span>
                  </div>

                  <motion.div
                    className="space-y-1 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.7 }}
                  >
                    <div><span className="text-indigo-400">➜</span> <span className="text-green-400">jjugg</span> v1.2.0</div>
                    <div><span className="text-blue-400">info</span> Loading configuration from /home/user/.config/jjugg/config.json</div>
                    <div><span className="text-blue-400">info</span> Initializing browser extension hooks...</div>
                    <div><span className="text-blue-400">info</span> Found 12 existing job applications in localStorage</div>
                    <div><span className="text-blue-400">info</span> Synchronizing with local database...</div>
                    <div><span className="text-blue-400">info</span> Loading email parsers for 5 providers...</div>
                    <div><span className="text-blue-400">info</span> Connecting to LLM service...</div>
                    <div><span className="text-blue-400">info</span> Starting web server on port 3000...</div>
                    <div><span className="text-green-400">success</span> jjugg is running at <span className="text-yellow-300">http://localhost:3000</span></div>
                  </motion.div>

                  <div className="flex mt-2">
                    <motion.span
                      className="text-slate-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 2.6 }}
                    >
                      <span className="text-green-400 mr-2">$</span>
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5, delay: 2.7 }}
                      className="text-slate-300"
                    >
                      |
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Documentation link */}
            <motion.div
              className="flex justify-center items-center mt-8 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a
                href="#"
                className={cn(
                  "flex items-center px-5 py-2 rounded-full font-medium font-inter text-sm transition-all",
                  theme === "dark"
                    ? "text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20"
                    : "text-indigo-700 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200"
                )}
              >
                <FileText className="w-4 h-4 mr-2" />
                View full documentation
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Cool animated code background */}
        <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-0 font-mono text-xs text-indigo-500/90"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 30 }).map((_, lineIndex) => (
              <div key={lineIndex} className="whitespace-nowrap">
                {Array.from({ length: 5 }).map((_, wordIndex) => {
                  const functions = ["localStorage.setItem", "parseEmail", "trackApplication", "formatResponse", "renderDashboard", "syncData"];
                  const objects = ["'application'", "'response'", "'interview'", "'email'", "'status'"];
                  return (
                    <span key={wordIndex} className="mr-4">
                      {functions[Math.floor(Math.random() * functions.length)]}
                      ({objects[Math.floor(Math.random() * objects.length)]})
                    </span>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="screenshots">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="flex justify-center mb-4">
              <span className="px-4 py-1 rounded-full text-sm font-medium font-inter bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 text-indigo-500 border border-indigo-500/20">
                Visual Tour
              </span>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold font-outfit tracking-tight mb-4"
            >
              See{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500">
                jjugg
              </span>
              {" "}in Action
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
            >
              Explore the intuitive interface and powerful features of jjugg through these screenshots.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {SCREENSHOTS.map((screenshot, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openLightbox(screenshot)}
                whileHover="hover"
              >
                <motion.div
                  className="overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
                <motion.div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-xl"
                  )}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <h3 className="text-xl font-semibold font-outfit text-white mb-1">{screenshot.title}</h3>
                  <p className="text-slate-300">{screenshot.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && currentScreenshot && (
              <motion.div
                className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  className="absolute top-4 right-4 text-white text-4xl"
                  onClick={closeLightbox}
                  whileHover={{ scale: 1.1 }}
                >
                  &times;
                </motion.button>
                <motion.div
                  className="max-w-5xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  <Image
                    src={currentScreenshot.image}
                    alt={currentScreenshot.title}
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-xl border border-slate-700 shadow-2xl"
                  />
                  <div className="text-center mt-6">
                    <h3 className="text-xl font-semibold font-outfit text-white mb-1">{currentScreenshot.title}</h3>
                    <p className="text-slate-400">{currentScreenshot.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Analytics Demo Section */}
      <section className={cn(
        "py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden",
        theme === "dark" ? "bg-gradient-to-b from-slate-900 to-slate-950" : "bg-gradient-to-b from-slate-50 to-white"
      )} id="analytics-demo">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="flex justify-center mb-4">
              <span className="px-4 py-1 rounded-full text-sm font-medium font-inter bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 text-indigo-500 border border-indigo-500/20">
                Data-Driven
              </span>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold font-outfit tracking-tight mb-4"
            >
              See Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500">
                Progress
              </span>
            </motion.h2>
            <motion.div
              variants={fadeIn}
              className={`text-lg max-w-2xl mx-auto font-inter ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
            >
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                {">"} Track application metrics:
              </motion.span>
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="overflow-hidden inline-block whitespace-nowrap ml-1"
              >
                <span className="text-indigo-500">collecting data</span> → <span className="text-blue-500">analyzing patterns</span> → <span className="text-purple-500">optimizing your search</span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 2, duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                className="inline-block ml-1"
              >
                |
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.div
            className={cn(
              "max-w-4xl mx-auto p-8 rounded-xl border shadow-lg backdrop-blur-md",
              theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-medium font-outfit mb-4">Monthly Job Applications</h3>
            <canvas ref={chartRef} className="w-full h-[300px]"></canvas>
          </motion.div>
        </div>

        {/* Background decorations */}
        <div className="absolute -z-10 inset-0 overflow-hidden opacity-20 pointer-events-none">
          <svg className="absolute top-0 right-0 w-1/2 h-full opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill={theme === "dark" ? "#6366f1" : "#6366f1"} d="M36.5,-60.7C46.7,-54.3,54.1,-42.7,61.7,-30.4C69.3,-18.1,77,-5.2,76.1,7.1C75.2,19.4,65.6,31.1,54.9,39.6C44.2,48.1,32.4,53.5,20.2,58.8C8,64.1,-4.7,69.4,-18.4,69.1C-32.1,68.8,-46.8,62.9,-57.2,52.2C-67.7,41.5,-73.9,26,-75.5,10.1C-77.1,-5.9,-74.1,-22.2,-66.1,-35.5C-58.1,-48.7,-45.1,-58.9,-31.6,-63.4C-18.1,-67.9,-4.1,-66.7,8.5,-62.7C21.2,-58.7,26.3,-67.1,36.5,-60.7Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-1/2 h-full opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill={theme === "dark" ? "#8b5cf6" : "#8b5cf6"} d="M45.3,-70.1C59.2,-62.5,71.3,-49.8,78.6,-34.4C85.9,-19,88.3,-0.9,84.5,15.2C80.8,31.3,70.9,45.3,58.2,55.1C45.5,64.9,30,70.5,13.3,75.3C-3.3,80.1,-21.1,84.2,-36.2,79.5C-51.4,74.8,-63.9,61.4,-70.8,46C-77.7,30.5,-79,13,-78.3,-4.3C-77.6,-21.6,-75,-38.7,-65.3,-49.2C-55.7,-59.7,-39.1,-63.5,-24.2,-70.4C-9.3,-77.3,3.9,-87.2,17.7,-84.5C31.5,-81.8,31.5,-77.7,45.3,-70.1Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Community Contributions Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="community-contributions">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="flex justify-center mb-4">
              <span className="px-4 py-1 rounded-full text-sm font-medium font-inter bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 text-indigo-500 border border-indigo-500/20">
                Open Source
              </span>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold font-outfit tracking-tight mb-4"
            >
              Community{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500">
                Contributions
              </span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
            >
              Join our open-source community and help shape the future of jjugg.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {CONTRIBUTIONS.map((contribution, index) => (
              <motion.div
                key={index}
                className={cn(
                  "group p-8 rounded-xl border backdrop-blur-md relative overflow-hidden",
                  "before:absolute before:inset-0 before:bg-gradient-to-b before:opacity-0 before:transition-all before:duration-300 before:hover:opacity-100 before:-z-10",
                  theme === "dark"
                    ? "bg-slate-900/40 border-slate-800 hover:border-indigo-500/40 before:from-indigo-500/5 before:to-purple-500/5"
                    : "bg-white/40 border-slate-200 hover:border-indigo-500/40 before:from-indigo-500/5 before:to-purple-500/5"
                )}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className={cn(
                  "w-16 h-16 flex items-center justify-center mb-6 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
                  theme === "dark" ? "bg-slate-800" : "bg-slate-100",
                  "group-hover:bg-gradient-to-br group-hover:from-indigo-500/10 group-hover:to-purple-500/10"
                )}>
                  <motion.div
                    animate={{ rotate: [0, 3, 0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 5, repeatType: "loop" }}
                  >
                    {contribution.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold font-outfit mb-4">{contribution.title}</h3>
                <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>{contribution.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold font-outfit mb-8">Meet Our Top Contributors</h3>
            <div className="flex flex-wrap justify-center gap-10 mb-12">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-20 h-20 relative mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 animate-spin-slow blur-sm opacity-70"></div>
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 p-1">
                      <div className={`rounded-full overflow-hidden w-full h-full ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                        <Image
                          src={`/avatar${i}.jpg`}
                          alt={`Contributor ${i}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="font-medium font-inter">Contributor {i}</p>
                  <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {i === 1 ? "UI Designer" : i === 2 ? "Backend Dev" : "Feature Lead"}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button asChild size="lg" className="font-inter rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl group">
                <a href="https://github.com/jjugg" target="_blank" rel="noopener noreferrer">
                  Contribute Now
                  <Github className="ml-2 h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="cta">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className={cn(
              "max-w-3xl mx-auto p-12 rounded-2xl border backdrop-blur-md relative overflow-hidden shadow-xl",
              theme === "dark"
                ? "bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 border-slate-800"
                : "bg-gradient-to-br from-white/80 via-white/60 to-slate-50/80 border-slate-200"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative z-10"
            >
              <motion.h2
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold font-outfit tracking-tight mb-4 text-center"
              >
                Ready to{" "}
                <motion.span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 inline-block"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [-1, 1, -1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  Automate
                </motion.span>
                {" "}Your Job Search?
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className={`text-lg mb-8 max-w-xl mx-auto text-center ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
              >
                Join the open-source movement revolutionizing job applications. No more manual tracking—our userscripts capture data as you apply, email parsers monitor status changes, and AI prepares you for interviews.
              </motion.p>
              <motion.div variants={fadeIn} className="max-w-md mx-auto">
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Input
                    type="email"
                    placeholder="Your Email"
                    className={`h-12 px-5 rounded-full shadow-inner font-inter ${theme === "dark" ? "bg-slate-800 border-slate-700 focus:border-indigo-500/50 focus:ring-indigo-500/30" : "bg-white border-slate-300 focus:border-indigo-500/50 focus:ring-indigo-500/30"}`}
                    required
                  />
                  <Button size="lg" className="font-inter rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 px-6 whitespace-nowrap">
                    Get Started Free
                  </Button>
                </motion.div>
                <motion.p
                  variants={fadeIn}
                  className={`text-center text-sm mt-4 ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`}
                >
                  Free 14-day trial. No credit card required.
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={cn(
        "py-16 px-4 sm:px-6 lg:px-8 border-t",
        theme === "dark" ? "bg-slate-950 border-slate-800/50" : "bg-white border-slate-200/50"
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-outfit tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500">
                  jjugg
                </span>
              </h3>
              <p className={`max-w-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                The ultimate job application tracker for modern professionals.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <Facebook size={18} />, href: "#" },
                  { icon: <Twitter size={18} />, href: "#" },
                  { icon: <Instagram size={18} />, href: "#" },
                  { icon: <Github size={18} />, href: "#" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                      theme === "dark"
                        ? "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500"
                        : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-500"
                    )}
                    whileHover={{ y: -3, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "Documentation", href: "#" },
                  { label: "Changelog", href: "#" }
                ]
              },
              {
                title: "Company",
                links: [
                  { label: "About Us", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Contact", href: "#" }
                ]
              },
              {
                title: "Support",
                links: [
                  { label: "Help Center", href: "#" },
                  { label: "FAQs", href: "#" },
                  { label: "Status", href: "#" },
                  { label: "Feedback", href: "#" }
                ]
              }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="text-lg font-semibold mb-4 font-outfit">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <motion.a
                        href={link.href}
                        className={`inline-block ${theme === "dark" ? "text-slate-400 hover:text-indigo-400" : "text-slate-600 hover:text-indigo-600"} hover:underline`}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4
            ${theme === "dark" ? "border-slate-800/50" : "border-slate-200/50"}`}
          >
            <p className={theme === "dark" ? "text-slate-500" : "text-slate-600"}>
              © 2023 jjugg. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a
                href="#"
                className={`text-sm ${theme === "dark" ? "text-slate-500 hover:text-indigo-400" : "text-slate-600 hover:text-indigo-600"} hover:underline`}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className={`text-sm ${theme === "dark" ? "text-slate-500 hover:text-indigo-400" : "text-slate-600 hover:text-indigo-600"} hover:underline`}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ChevronRight, Github, Twitter, Instagram, Facebook, Check, Globe, FileText, Layout } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import * as THREE from 'three';
import { Chart, registerables } from 'chart.js';

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
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>,
    title: "Never Miss an Opportunity: Effortless Tracking",
    description: "Manage all your job applications in one place with our intuitive dashboard and customizable views."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8v8m-4-8v8m-4-8v8m-4 8h16" />
    </svg>,
    title: "Make Data-Driven Decisions: Insightful Analytics",
    description: "Gain valuable insights into your job search with detailed analytics and progress tracking."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    title: "Showcase Your Work: Seamless GitHub Integration",
    description: "Connect with GitHub to showcase your projects and enhance your applications."
  }
];

const TESTIMONIALS = [
  {
    image: "/user1.jpg",
    quote: "jjugg kept me organized and helped me land my dream job in just 3 months!",
    name: "John Doe",
    title: "Software Engineer"
  },
  {
    image: "/user2.jpg",
    quote: "The analytics feature showed me where to focus my efforts—game changer!",
    name: "Jane Smith",
    title: "Product Manager"
  },
  {
    image: "/user3.jpg",
    quote: "GitHub integration made showcasing my portfolio effortless.",
    name: "Alex Johnson",
    title: "Web Developer"
  }
];

const SCREENSHOTS = [
  {
    image: "/dashboard.jpg",
    title: "jjugg Dashboard"
  },
  {
    image: "/applications_grid.jpg",
    title: "Application Tracking"
  },
  {
    image: "/screenshot3.jpg",
    title: "Analytics Overview"
  }
];

const CONTRIBUTIONS = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Code Contributions",
    description: "Contribute to the development of jjugg by submitting pull requests on GitHub."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Report Issues",
    description: "Help improve jjugg by reporting bugs and issues you encounter."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Suggest Features",
    description: "Share your ideas for new features and enhancements to make jjugg even better."
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(null);
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      u_colorA: { value: new THREE.Color(theme === 'dark' ? '#111111' : '#e5e5e5') },
      u_colorB: { value: new THREE.Color(theme === 'dark' ? '#222222' : '#f5f5f5') }
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
        vec3 color = mix(u_colorA, u_colorB, uv.x + noise * 0.1);
        color += (1.0 - distort) * 0.3;

        // Subtle glow effect
        float glow = pow(1.0 - distance(uv, mouse), 4.0) * 0.5;
        color += glow * u_colorA;

        gl_FragColor = vec4(color, 0.8 - noise * 0.2);
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
      uniforms.u_colorA.value = new THREE.Color(theme === 'dark' ? '#111111' : '#e5e5e5');
      uniforms.u_colorB.value = new THREE.Color(theme === 'dark' ? '#222222' : '#f5f5f5');
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
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Applications',
          data: [12, 19, 3, 5, 2],
          backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
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
              color: theme === 'dark' ? '#cccccc' : '#333333'
            },
            grid: {
              color: theme === 'dark' ? '#333333' : '#eeeeee'
            }
          },
          x: {
            ticks: {
              color: theme === 'dark' ? '#cccccc' : '#333333'
            },
            grid: {
              color: theme === 'dark' ? '#333333' : '#eeeeee'
            }
          }
        },
        plugins: { 
          legend: { 
            labels: { 
              color: theme === 'dark' ? '#ffffff' : '#000000' 
            } 
          } 
        }
      }
    });
  };

  const updateChartColors = () => {
    if (!chartInstance.current) return;
    
    chartInstance.current.data.datasets[0].backgroundColor = theme === 'dark' ? '#ffffff' : '#000000';
    chartInstance.current.data.datasets[0].borderColor = theme === 'dark' ? '#333333' : '#dddddd';
    
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
        {/* Shader Background Canvas */}
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10"></canvas>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-3 py-2 text-sm rounded-none font-mono border
          ${theme === "dark" ? "border-gray-700 bg-gray-900/80" : "border-gray-300 bg-white/80"} backdrop-blur-md transition-all hover:border-primary focus:outline-primary focus:outline-offset-2 focus:outline-2`}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Navigation */}
        <nav className={`fixed top-0 left-0 w-full py-4 z-40 backdrop-blur-md border-b
        ${theme === "dark" ? "border-gray-800 bg-black/80" : "border-gray-200 bg-white/80"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <a href="#" className="text-2xl font-bold font-mono">jjugg</a>
            <div className={`hidden md:flex space-x-8 font-mono text-sm`}>
              <a href="#features" className={`relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${theme === "dark" ? "text-gray-400 hover:text-white after:bg-white" : "text-gray-600 hover:text-black after:bg-black"}`}>Features</a>
              <a href="#testimonials" className={`relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${theme === "dark" ? "text-gray-400 hover:text-white after:bg-white" : "text-gray-600 hover:text-black after:bg-black"}`}>Testimonials</a>
              <a href="#screenshots" className={`relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${theme === "dark" ? "text-gray-400 hover:text-white after:bg-white" : "text-gray-600 hover:text-black after:bg-black"}`}>Screenshots</a>
              <a href="#analytics-demo" className={`relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${theme === "dark" ? "text-gray-400 hover:text-white after:bg-white" : "text-gray-600 hover:text-black after:bg-black"}`}>Analytics</a>
              <a href="#community-contributions" className={`relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${theme === "dark" ? "text-gray-400 hover:text-white after:bg-white" : "text-gray-600 hover:text-black after:bg-black"}`}>Community</a>
              <a href="#cta" className={`relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${theme === "dark" ? "text-gray-400 hover:text-white after:bg-white" : "text-gray-600 hover:text-black after:bg-black"}`}>Get Started</a>
            </div>
            <Button className="hidden md:flex font-mono">Get Started</Button>
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
                className={`md:hidden ${theme === "dark" ? "bg-black/95" : "bg-white/95"} backdrop-blur-md`}
              >
                <div className="px-4 py-4 space-y-4 font-mono text-sm">
                  <a href="#features" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                  <a href="#testimonials" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                  <a href="#screenshots" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Screenshots</a>
                  <a href="#analytics-demo" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Analytics</a>
                  <a href="#community-contributions" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Community</a>
                  <a href="#cta" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Get Started</a>
                  <Button className="w-full font-mono mt-4" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-16 relative overflow-hidden" id="hero">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="z-10"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Land Your Dream Job Faster with <span className="text-primary">jjugg</span>
              </h1>
              <p className={`text-lg mb-8 max-w-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                The all-in-one platform to organize, track, and analyze your job applications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="font-mono">
                  <a href="#cta">Get Started Free</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-mono">
                  <a href="#features">Explore Features</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Job Application Timeline Visualization */}
              <div className="w-full">
                <svg width="100%" height="120" viewBox="0 0 600 120" preserveAspectRatio="xMidYMid meet">
                  <line x1="50" y1="60" x2="550" y2="60" stroke={theme === "dark" ? "#666" : "#ccc"} strokeWidth="2" />
                  <circle cx="50" cy="60" r="10" fill={theme === "dark" ? "#666" : "#999"} className="transition-transform hover:scale-125 duration-300" />
                  <circle cx="200" cy="60" r="10" fill={theme === "dark" ? "#888" : "#777"} className="transition-transform hover:scale-125 duration-300" />
                  <circle cx="350" cy="60" r="10" fill={theme === "dark" ? "#888" : "#777"} className="transition-transform hover:scale-125 duration-300" />
                  <circle cx="450" cy="60" r="10" fill={theme === "dark" ? "#aaa" : "#555"} className="transition-transform hover:scale-125 duration-300" />
                  <circle cx="550" cy="60" r="10" fill={theme === "dark" ? "#fff" : "#000"} className="transition-transform hover:scale-125 duration-300" />

                  <motion.path
                    d="M50 60 H550"
                    stroke={theme === "dark" ? "#fff" : "#000"}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </svg>
                <div className="flex justify-between text-center text-sm mt-2">
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Applied</span>
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Interview Scheduled</span>
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Interviewed</span>
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Offer Received</span>
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Accepted</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <motion.div
              className={`absolute w-96 h-96 rounded-none border-2 ${theme === "dark" ? "border-gray-800" : "border-gray-200"} opacity-20`}
              style={{ top: '10%', left: '10%' }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={`absolute w-72 h-72 rounded-none border-2 ${theme === "dark" ? "border-gray-800" : "border-gray-200"} opacity-20`}
              style={{ bottom: '20%', right: '5%' }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div
              className={`absolute w-48 h-48 rounded-none border-2 ${theme === "dark" ? "border-gray-800" : "border-gray-200"} opacity-20`}
              style={{ top: '40%', right: '30%' }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Why Choose <span className="text-primary">jjugg</span>?
              </motion.h2>
              <motion.p 
                className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Discover the powerful features that make jjugg the ultimate job application tracker.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`group p-8 rounded-none border backdrop-blur-md shadow-md transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl relative overflow-hidden
                  ${theme === "dark" ? "bg-gray-900/80 border-gray-800 hover:border-primary" : "bg-white/80 border-gray-200 hover:border-primary"}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute top-0 left-0 w-full h-[5px] bg-primary origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                  <div className={`w-14 h-14 flex items-center justify-center mb-6 rounded-none transition-transform duration-300 group-hover:scale-110
                    ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`py-24 px-4 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`} id="testimonials">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                What Our Users <span className="text-primary">Say</span>
              </motion.h2>
              <motion.p 
                className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Hear from job seekers who transformed their search with jjugg.
              </motion.p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={`p-8 rounded-none border backdrop-blur-md shadow-md max-w-sm text-center
                    ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary">
                    <Image src={testimonial.image} alt={testimonial.name} width={80} height={80} />
                  </div>
                  <p className={`italic mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.name}, <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{testimonial.title}</span></p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="screenshots">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                See <span className="text-primary">jjugg</span> in Action
              </motion.h2>
              <motion.p 
                className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Explore the intuitive interface and powerful features of jjugg through these screenshots.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SCREENSHOTS.map((screenshot, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer rounded-none border overflow-hidden shadow-md transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl
                    ${theme === "dark" ? "border-gray-800 hover:border-primary" : "border-gray-200 hover:border-primary"}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => openLightbox(screenshot)}
                >
                  <Image 
                    src={screenshot.image} 
                    alt={screenshot.title} 
                    width={500} 
                    height={300} 
                    className="w-full h-auto"
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Lightbox */}
            <AnimatePresence>
              {lightboxOpen && currentScreenshot && (
                <motion.div
                  className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    className="absolute top-4 right-4 text-white text-4xl"
                    onClick={closeLightbox}
                  >
                    &times;
                  </button>
                  <div className="max-w-5xl">
                    <Image 
                      src={currentScreenshot.image} 
                      alt={currentScreenshot.title} 
                      width={1200} 
                      height={800} 
                      className="w-full h-auto border border-gray-700"
                    />
                    <p className="text-center text-gray-400 mt-4">{currentScreenshot.title}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Analytics Demo Section */}
        <section className={`py-24 px-4 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`} id="analytics-demo">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                See Your <span className="text-primary">Progress</span>
              </motion.h2>
              <motion.p 
                className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Track your application status and performance with advanced analytics.
              </motion.p>
            </div>
            
            <motion.div 
              className={`max-w-3xl mx-auto p-8 rounded-none border shadow-md
                ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <canvas ref={chartRef}></canvas>
            </motion.div>
          </div>
        </section>

        {/* Community Contributions Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="community-contributions">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Community <span className="text-primary">Contributions</span>
              </motion.h2>
              <motion.p 
                className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Join our open-source community and help shape the future of jjugg.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {CONTRIBUTIONS.map((contribution, index) => (
                <motion.div
                  key={index}
                  className={`group p-8 rounded-none border backdrop-blur-md shadow-md transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl relative overflow-hidden
                  ${theme === "dark" ? "bg-gray-900/80 border-gray-800 hover:border-primary" : "bg-white/80 border-gray-200 hover:border-primary"}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute top-0 left-0 w-full h-[5px] bg-primary origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                  <div className={`w-14 h-14 flex items-center justify-center mb-6 rounded-none transition-transform duration-300 group-hover:scale-110
                    ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                    {contribution.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{contribution.title}</h3>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{contribution.description}</p>
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
              <h3 className="text-2xl font-semibold mb-6">Top Contributors</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="text-center">
                  <Image 
                    src="/avatar1.jpg" 
                    alt="Contributor 1" 
                    width={60} 
                    height={60} 
                    className={`rounded-full border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                  />
                  <p className="mt-2">Contributor 1</p>
                </div>
                <div className="text-center">
                  <Image 
                    src="/avatar2.jpg" 
                    alt="Contributor 2" 
                    width={60} 
                    height={60} 
                    className={`rounded-full border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                  />
                  <p className="mt-2">Contributor 2</p>
                </div>
                <div className="text-center">
                  <Image 
                    src="/avatar3.jpg" 
                    alt="Contributor 3" 
                    width={60} 
                    height={60} 
                    className={`rounded-full border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                  />
                  <p className="mt-2">Contributor 3</p>
                </div>
              </div>
              <Button asChild size="lg" className="font-mono">
                <a href="https://github.com/jjugg" target="_blank" rel="noopener noreferrer">Contribute Now</a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="cta">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className={`max-w-3xl mx-auto p-12 rounded-none border backdrop-blur-md text-center relative overflow-hidden shadow-md
                ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-4">Ready to <span className="text-primary">Transform</span> Your Job Search?</h2>
              <p className={`text-lg mb-8 max-w-xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Join thousands of job seekers who landed their dream jobs with jjugg.
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input 
                    type="email" 
                    placeholder="Your Email" 
                    className={`h-11 font-mono rounded-none ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`} 
                    required 
                  />
                  <Button size="lg" className="font-mono">Get Started Free</Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-16 px-4 sm:px-6 lg:px-8 border-t ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200"}`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-mono">jjugg</h3>
                <p className={`max-w-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  The ultimate job application tracker for modern professionals.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className={`w-10 h-10 flex items-center justify-center rounded-none transition-colors duration-300
                      ${theme === "dark" ? "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-primary hover:text-white hover:border-primary" : 
                        "bg-gray-200 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary"}`}
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="#" 
                    className={`w-10 h-10 flex items-center justify-center rounded-none transition-colors duration-300
                      ${theme === "dark" ? "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-primary hover:text-white hover:border-primary" : 
                        "bg-gray-200 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary"}`}
                  >
                    <Twitter size={18} />
                  </a>
                  <a 
                    href="#" 
                    className={`w-10 h-10 flex items-center justify-center rounded-none transition-colors duration-300
                      ${theme === "dark" ? "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-primary hover:text-white hover:border-primary" : 
                        "bg-gray-200 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary"}`}
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="#" 
                    className={`w-10 h-10 flex items-center justify-center rounded-none transition-colors duration-300
                      ${theme === "dark" ? "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-primary hover:text-white hover:border-primary" : 
                        "bg-gray-200 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary"}`}
                  >
                    <Github size={18} />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 font-mono">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#features" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Changelog
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 font-mono">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 font-mono">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Status
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`inline-block ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                        hover:underline`}
                    >
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4
              ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                © 2023 jjugg. All rights reserved.
              </p>
              <div className="flex space-x-8">
                <a 
                  href="#" 
                  className={`text-sm ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                    hover:underline`}
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className={`text-sm ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} 
                    hover:underline`}
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
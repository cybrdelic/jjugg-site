"use client";

import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { ArrowDownCircle } from 'lucide-react';
import * as THREE from 'three';

export function ThreeJsHero() {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const shaderMaterialRef = useRef(null);
    const clockRef = useRef(new THREE.Clock());
    const animationRef = useRef(null);

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState(0);

    // Initialize Three.js scene
    useEffect(() => {
        setMounted(true);

        const init = () => {
            if (!containerRef.current) return;

            // Create scene
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            // Create camera
            const camera = new THREE.PerspectiveCamera(
                75,
                containerRef.current.clientWidth / containerRef.current.clientHeight,
                0.1,
                1000
            );
            camera.position.z = 5;
            cameraRef.current = camera;

            // Create renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Create shader material with simplified and fixed fragment shader
            const shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                    uResolution: {
                        value: new THREE.Vector2(
                            containerRef.current.clientWidth,
                            containerRef.current.clientHeight
                        )
                    },
                    uScroll: { value: 0 },
                    uDark: { value: theme === 'dark' ? 1.0 : 0.0 }
                },
                vertexShader: `
                    varying vec2 vUv;

                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float uTime;
                    uniform vec2 uMouse;
                    uniform vec2 uResolution;
                    uniform float uScroll;
                    uniform float uDark;

                    varying vec2 vUv;

                    // Simple noise function
                    float noise(vec2 p) {
                        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                    }

                    void main() {
                        // Normalize coordinates
                        vec2 uv = vUv;
                        vec2 center = vec2(0.5, 0.5);

                        // Calculate distance from center
                        float dist = distance(uv, center);

                        // Calculate distance from mouse
                        float mouseDist = distance(uv, uMouse / uResolution);

                        // Create color gradients based on theme
                        vec3 col;

                        // Calculate color based on theme (dark or light)
                        if (uDark > 0.5) {
                            // Dark theme colors
                            col = mix(
                                vec3(0.1, 0.1, 0.2),
                                vec3(0.2, 0.2, 0.3),
                                uv.y
                            );

                            // Add color variations based on position
                            col += 0.1 * vec3(0.5 + 0.5 * sin(uTime * 0.5 + uv.x * 5.0),
                                            0.5 + 0.5 * sin(uTime * 0.4 + uv.y * 5.0),
                                            0.5 + 0.5 * sin(uTime * 0.3 + dist * 10.0));

                            // Add star-like bright points
                            float n = noise(uv * 500.0);
                            if (n > 0.97) {
                                col += vec3(0.6, 0.7, 1.0) * (n - 0.97) * 30.0;
                            }
                        } else {
                            // Light theme colors
                            col = mix(
                                vec3(0.8, 0.85, 0.9),
                                vec3(0.7, 0.75, 0.85),
                                uv.y
                            );

                            // Add subtle variations
                            col += 0.05 * vec3(0.5 + 0.5 * sin(uTime * 0.3 + uv.x * 3.0),
                                            0.5 + 0.5 * sin(uTime * 0.2 + uv.y * 3.0),
                                            0.5 + 0.5 * sin(uTime * 0.1 + dist * 5.0));
                        }

                        // Add mouse interaction glow
                        float glow = 0.05 / (0.01 + mouseDist * 2.0);
                        col += uDark > 0.5 ?
                            vec3(0.3, 0.4, 1.0) * glow :
                            vec3(0.4, 0.6, 1.0) * glow * 0.5;

                        // Add scroll effect
                        col *= 1.0 - 0.2 * uScroll;

                        // Add vignette effect
                        float vignette = 1.0 - dist * 1.0;
                        col *= vignette;

                        // Output final color
                        gl_FragColor = vec4(col, 1.0);
                    }
                `,
                transparent: true
            });

            shaderMaterialRef.current = shaderMaterial;

            // Create a simple plane geometry that fills the view
            const geometry = new THREE.PlaneGeometry(10, 10);
            const mesh = new THREE.Mesh(geometry, shaderMaterial);
            scene.add(mesh);

            // Responsive handling
            const handleResize = () => {
                if (!containerRef.current) return;

                const width = containerRef.current.clientWidth;
                const height = containerRef.current.clientHeight;

                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                if (shaderMaterial.uniforms.uResolution) {
                    shaderMaterial.uniforms.uResolution.value.set(width, height);
                }
            };

            window.addEventListener('resize', handleResize);

            // Animation loop
            const animate = () => {
                if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

                const elapsedTime = clockRef.current.getElapsedTime();

                if (shaderMaterialRef.current) {
                    shaderMaterialRef.current.uniforms.uTime.value = elapsedTime;
                }

                rendererRef.current.render(sceneRef.current, cameraRef.current);
                animationRef.current = requestAnimationFrame(animate);
            };

            animate();

            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }

                if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }

                if (geometry) geometry.dispose();
                if (shaderMaterial) shaderMaterial.dispose();
                if (renderer) renderer.dispose();
            };
        };

        // Run init if component is mounted
        if (mounted) {
            const cleanup = init();
            return cleanup;
        }
    }, [mounted, theme]);

    // Track mouse position
    useEffect(() => {
        if (!mounted) return;

        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });

            if (shaderMaterialRef.current) {
                shaderMaterialRef.current.uniforms.uMouse.value.set(e.clientX, e.clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mounted]);

    // Track scroll position
    useEffect(() => {
        if (!mounted) return;

        const handleScroll = () => {
            const scrollPos = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            setScrollPosition(scrollPos);

            if (shaderMaterialRef.current) {
                shaderMaterialRef.current.uniforms.uScroll.value = scrollPos;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

    // Update shader when theme changes
    useEffect(() => {
        if (!mounted || !shaderMaterialRef.current) return;

        shaderMaterialRef.current.uniforms.uDark.value = theme === 'dark' ? 1.0 : 0.0;
    }, [theme, mounted]);

    if (!mounted) return null;

    return (
        <div className="threejs-hero">
            {/* This div will hold the THREE.js canvas */}
            <div ref={containerRef} className="absolute inset-0"></div>

            {/* Overlay for better text visibility */}
            <div className="threejs-hero-overlay"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 threejs-hero-content">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="backdrop-blur-sm bg-slate-900/30 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-400/20 max-w-lg"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 mb-4">
                        Visualize Your Job Search
                    </h2>
                    <p className="text-slate-300 mb-6">
                        Interactive tools to track applications, analyze performance, and celebrate success
                    </p>
                    <div className="flex gap-4 justify-center interactive">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(99, 102, 241, 0.3)" }}
                            className="px-5 py-2 rounded-full font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
                        >
                            Get Started
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-5 py-2 rounded-full font-medium bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700/80 transition-all"
                        >
                            Learn More
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    className="absolute bottom-8 interactive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{
                        opacity: { delay: 2, duration: 1 },
                        y: { delay: 2, duration: 1.5, repeat: Infinity }
                    }}
                >
                    <ArrowDownCircle className="w-8 h-8 text-white/60" />
                </motion.div>
            </div>
        </div>
    );
}

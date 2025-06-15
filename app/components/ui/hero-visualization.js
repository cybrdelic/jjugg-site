"use client";

import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

export function HeroVisualization() {
    const containerRef = useRef(null);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Major tech cities with job market data
    const techHubs = [
        { name: "San Francisco", lat: 37.7749, lng: -122.4194, jobs: 1250, growth: 12.5, color: 0x0ea5e9 },
        { name: "New York", lat: 40.7128, lng: -74.0060, jobs: 1800, growth: 8.3, color: 0x8b5cf6 },
        { name: "London", lat: 51.5074, lng: -0.1278, jobs: 980, growth: 15.2, color: 0x10b981 },
        { name: "Berlin", lat: 52.5200, lng: 13.4050, jobs: 720, growth: 22.1, color: 0xf59e0b },
        { name: "Tokyo", lat: 35.6762, lng: 139.6503, jobs: 890, growth: 6.7, color: 0xef4444 },
        { name: "Singapore", lat: 1.3521, lng: 103.8198, jobs: 650, growth: 18.9, color: 0x06b6d4 },
        { name: "Toronto", lat: 43.6532, lng: -79.3832, jobs: 540, growth: 14.3, color: 0x84cc16 },
        { name: "Sydney", lat: -33.8688, lng: 151.2093, jobs: 420, growth: 11.8, color: 0xf97316 },
        { name: "Amsterdam", lat: 52.3676, lng: 4.9041, jobs: 380, growth: 19.4, color: 0xe879f9 },
        { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, jobs: 310, growth: 25.6, color: 0x3b82f6 }
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !containerRef.current) return;

        let scene, camera, renderer, earth, atmosphere, stars;
        let jobMarkers = [], connections = [], particles = [];
        let animationId, mouseX = 0, mouseY = 0;

        const init = async () => {
            // Scene setup with dramatic lighting
            scene = new THREE.Scene();

            // Camera positioned for cinematic view
            camera = new THREE.PerspectiveCamera(
                60,
                containerRef.current.clientWidth / containerRef.current.clientHeight,
                0.1,
                1000
            );
            camera.position.set(0, 0, 50);

            // High-quality renderer with post-processing effects
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            containerRef.current.appendChild(renderer.domElement);

            // Create starfield background
            createStarField();

            // Load high-quality Earth textures from CDN
            const loader = new THREE.TextureLoader();
            const loadTexture = (url) => {
                return new Promise((resolve, reject) => {
                    loader.load(url, resolve, (progress) => {
                        setLoadingProgress(Math.round((progress.loaded / progress.total) * 100));
                    }, reject);
                });
            };

            try {
                // High-resolution Earth textures from NASA/reliable CDNs
                const [
                    earthDayTexture,
                    earthNightTexture,
                    earthNormalTexture,
                    earthSpecularTexture,
                    earthCloudsTexture
                ] = await Promise.all([
                    loadTexture('https://unpkg.com/three-globe/example/img/earth-day.jpg'),
                    loadTexture('https://unpkg.com/three-globe/example/img/earth-night.jpg'),
                    loadTexture('https://unpkg.com/three-globe/example/img/earth-topology.png'),
                    loadTexture('https://unpkg.com/three-globe/example/img/earth-water.png'),
                    loadTexture('https://unpkg.com/three-globe/example/img/earth-clouds.png')
                ]);

                // Create the main Earth sphere with advanced materials
                createEarth(earthDayTexture, earthNightTexture, earthNormalTexture, earthSpecularTexture);

                // Create atmospheric effects
                createAtmosphere();

                // Add dynamic cloud layer
                createClouds(earthCloudsTexture);

                setLoadingProgress(100);
            } catch (error) {
                console.warn('Failed to load high-res textures, using fallback:', error);
                createFallbackEarth();
            }

            // Add dramatic lighting setup
            setupLighting();

            // Create job market markers
            createJobMarkers();

            // Add particle effects
            createParticleSystem();

            // Mouse interaction
            setupMouseInteraction();
        };

        const createStarField = () => {
            const starsGeometry = new THREE.BufferGeometry();
            const starsMaterial = new THREE.PointsMaterial({
                color: theme === 'dark' ? 0xffffff : 0x4a5568,
                size: 0.5,
                transparent: true,
                opacity: theme === 'dark' ? 0.8 : 0.3
            });

            const starsVertices = [];
            for (let i = 0; i < 10000; i++) {
                const x = (Math.random() - 0.5) * 2000;
                const y = (Math.random() - 0.5) * 2000;
                const z = (Math.random() - 0.5) * 2000;
                starsVertices.push(x, y, z);
            }

            starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
            stars = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(stars);
        };

        const createEarth = (dayTexture, nightTexture, normalTexture, specularTexture) => {
            const earthGeometry = new THREE.SphereGeometry(15, 64, 64);

            // Advanced earth material with day/night cycle simulation
            const earthMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    dayTexture: { value: dayTexture },
                    nightTexture: { value: nightTexture },
                    normalMap: { value: normalTexture },
                    specularMap: { value: specularTexture },
                    lightDirection: { value: new THREE.Vector3(1, 0, 0.5).normalize() },
                    time: { value: 0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        vUv = uv;
                        vNormal = normalize(normalMatrix * normal);
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D dayTexture;
                    uniform sampler2D nightTexture;
                    uniform sampler2D normalMap;
                    uniform sampler2D specularMap;
                    uniform vec3 lightDirection;
                    uniform float time;

                    varying vec2 vUv;
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        vec4 dayColor = texture2D(dayTexture, vUv);
                        vec4 nightColor = texture2D(nightTexture, vUv);
                        vec4 normalColor = texture2D(normalMap, vUv);
                        vec4 specularColor = texture2D(specularMap, vUv);

                        // Calculate lighting with rotating sun
                        vec3 rotatedLight = vec3(
                            lightDirection.x * cos(time * 0.1) - lightDirection.z * sin(time * 0.1),
                            lightDirection.y,
                            lightDirection.x * sin(time * 0.1) + lightDirection.z * cos(time * 0.1)
                        );

                        float intensity = dot(vNormal, rotatedLight);
                        float dayNightMix = smoothstep(-0.3, 0.3, intensity);

                        vec3 color = mix(nightColor.rgb * 1.5, dayColor.rgb, dayNightMix);

                        // Add specular highlights for water
                        float specular = pow(max(0.0, intensity), 32.0) * specularColor.r;
                        color += vec3(0.4, 0.6, 1.0) * specular * 0.5;

                        // Add atmospheric scattering
                        float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
                        color += vec3(0.3, 0.6, 1.0) * fresnel * 0.3;

                        gl_FragColor = vec4(color, 1.0);
                    }
                `
            });

            earth = new THREE.Mesh(earthGeometry, earthMaterial);
            earth.rotation.x = -Math.PI * 0.1;
            scene.add(earth);
        };

        const createAtmosphere = () => {
            const atmosphereGeometry = new THREE.SphereGeometry(15.5, 64, 64);
            const atmosphereMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vNormal;
                    uniform float time;

                    void main() {
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);

                        // Add subtle color variation
                        atmosphereColor.r += sin(time * 0.5) * 0.1;
                        atmosphereColor.g += cos(time * 0.3) * 0.1;

                        gl_FragColor = vec4(atmosphereColor, intensity * 0.6);
                    }
                `,
                blending: THREE.AdditiveBlending,
                transparent: true,
                side: THREE.BackSide
            });

            atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
            scene.add(atmosphere);
        };

        const createClouds = (cloudsTexture) => {
            const cloudsGeometry = new THREE.SphereGeometry(15.2, 64, 64);
            const cloudsMaterial = new THREE.MeshLambertMaterial({
                map: cloudsTexture,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });

            const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
            scene.add(clouds);

            // Animate clouds
            const animateClouds = () => {
                clouds.rotation.y += 0.0005;
            };

            return animateClouds;
        };

        const createFallbackEarth = () => {
            const earthGeometry = new THREE.SphereGeometry(15, 64, 64);
            const earthMaterial = new THREE.MeshPhongMaterial({
                color: theme === 'dark' ? 0x1e40af : 0x3b82f6,
                shininess: 30,
                transparent: true,
                opacity: 0.9
            });

            earth = new THREE.Mesh(earthGeometry, earthMaterial);
            earth.rotation.x = -Math.PI * 0.1;
            scene.add(earth);
        };

        const setupLighting = () => {
            // Ambient lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
            scene.add(ambientLight);

            // Main directional light (sun)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
            directionalLight.position.set(50, 30, 50);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);

            // Rim lighting
            const rimLight = new THREE.DirectionalLight(0x0080ff, 0.5);
            rimLight.position.set(-50, 0, -50);
            scene.add(rimLight);

            // Point lights for job market hotspots
            techHubs.forEach((city, index) => {
                const pointLight = new THREE.PointLight(city.color, 0.8, 10);
                const coords = latLngToVector3(city.lat, city.lng, 15.5);
                pointLight.position.copy(coords);
                scene.add(pointLight);
            });
        };

        const latLngToVector3 = (lat, lng, radius) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        };

        const createJobMarkers = () => {
            techHubs.forEach((city, index) => {
                // Create glowing marker
                const markerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const markerMaterial = new THREE.MeshPhongMaterial({
                    color: city.color,
                    emissive: city.color,
                    emissiveIntensity: 0.4,
                    transparent: true,
                    opacity: 0.9
                });

                const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                const position = latLngToVector3(city.lat, city.lng, 15.5);
                marker.position.copy(position);

                // Add pulsing animation
                marker.userData = {
                    originalScale: 1,
                    pulseSpeed: 0.02 + Math.random() * 0.01,
                    city: city
                };

                scene.add(marker);
                jobMarkers.push(marker);

                // Create data stream effect
                createDataStream(position, city);
            });
        };

        const createDataStream = (startPosition, city) => {
            const streamGeometry = new THREE.BufferGeometry();
            const streamMaterial = new THREE.LineBasicMaterial({
                color: city.color,
                transparent: true,
                opacity: 0.6,
                linewidth: 2
            });

            // Create curved path extending outward
            const curve = new THREE.QuadraticBezierCurve3(
                startPosition,
                startPosition.clone().multiplyScalar(1.3),
                startPosition.clone().multiplyScalar(1.8)
            );

            const points = curve.getPoints(20);
            streamGeometry.setFromPoints(points);

            const streamLine = new THREE.Line(streamGeometry, streamMaterial);
            streamLine.userData = { animationOffset: Math.random() * Math.PI * 2 };
            scene.add(streamLine);
            connections.push(streamLine);
        };

        const createParticleSystem = () => {
            // Create floating job opportunity particles
            const particleGeometry = new THREE.BufferGeometry();
            const particleCount = 1000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;

                // Random positions around Earth
                const radius = 18 + Math.random() * 10;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;

                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.cos(phi);
                positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

                // Random colors from tech hub palette
                const color = new THREE.Color(techHubs[i % techHubs.length].color);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;

                sizes[i] = 0.5 + Math.random() * 1.5;
            }

            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const particleMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
                    attribute float size;
                    varying vec3 vColor;
                    uniform float time;

                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;

                    void main() {
                        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                        if (distanceToCenter > 0.5) discard;

                        float alpha = 1.0 - (distanceToCenter * 2.0);
                        gl_FragColor = vec4(vColor, alpha * 0.8);
                    }
                `,
                transparent: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending
            });

            const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particleSystem);
            particles.push(particleSystem);
        };

        const setupMouseInteraction = () => {
            const handleMouseMove = (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        };

        const animate = () => {
            if (!scene || !camera || !renderer) return;

            const time = Date.now() * 0.001;

            // Rotate Earth
            if (earth) {
                earth.rotation.y += 0.002;

                // Update shader uniforms if using advanced materials
                if (earth.material.uniforms) {
                    earth.material.uniforms.time.value = time;
                }
            }

            // Animate atmosphere
            if (atmosphere && atmosphere.material.uniforms) {
                atmosphere.material.uniforms.time.value = time;
            }

            // Camera movement based on mouse
            const targetX = mouseX * 10;
            const targetY = mouseY * 5;

            camera.position.x += (targetX - camera.position.x) * 0.02;
            camera.position.y += (targetY - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);

            // Animate job markers
            jobMarkers.forEach((marker, index) => {
                const scale = 1 + Math.sin(time * 2 + index) * 0.3;
                marker.scale.setScalar(scale);

                // Rotate markers
                marker.rotation.y += 0.01;
            });

            // Animate particles
            particles.forEach(particleSystem => {
                if (particleSystem.material.uniforms) {
                    particleSystem.material.uniforms.time.value = time;
                }
                particleSystem.rotation.y += 0.0005;
            });

            // Animate connections
            connections.forEach(connection => {
                connection.material.opacity = 0.3 + Math.sin(time * 2 + connection.userData.animationOffset) * 0.3;
            });

            // Rotate stars slowly
            if (stars) {
                stars.rotation.y += 0.0001;
            }

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            if (!camera || !renderer || !containerRef.current) return;

            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        init().then(() => {
            animate();
        });

        return () => {
            window.removeEventListener('resize', handleResize);

            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            if (renderer && containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }

            // Cleanup Three.js resources
            scene?.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });

            renderer?.dispose();
        };
    }, [mounted, theme]);


    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full -z-10"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        >
            {loadingProgress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="text-white text-center">
                        <div className="mb-4">Loading Earth...</div>
                        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                        <div className="mt-2 text-sm">{loadingProgress}%</div>
                    </div>
                </div>
            )}
        </div>
    );
}

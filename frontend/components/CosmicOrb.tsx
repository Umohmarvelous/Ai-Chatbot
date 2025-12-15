'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import ChatBot from './ChatBot';

// --- Configuration Constants ---
const GREEN_PALETTE = [
    new THREE.Color(0x0f370e), // Dark Forest
    new THREE.Color(0x30622f), // Medium Olive
    new THREE.Color(0x8bad0d), // Bright Lime
    new THREE.Color(0x9bbc0e)  // Neon Green
];

const CONFIG = {
    orbRadius: 2.0,
    orbSegments: 64, 
    cameraZ: 7, 
    rotationSpeed: 0.005,      
    colorCycleSpeed: 0.05,     
    pulseSpeed: 1.5,      
    pulseMagnitude: 0.05, // Subtle grow effect
    baseScale: 1.0,
    orbDeformIntensity: 0.05, 
    orbDeformSpeed: 2.0       
};

const COLOR_CHANGE_INTERVAL = 5; 

// --- Helper: Texture Creation ---
function createDarkSparkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    if (!context) {
        throw new Error('Could not get 2d context');
    }
    
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(30, 30, 30, 1)'); 
    gradient.addColorStop(0.1, 'rgba(20, 20, 20, 0.8)'); 
    gradient.addColorStop(0.2, 'rgba(10, 10, 10, 0.3)'); 
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
}

interface StateType {
    mouseX: number;
    mouseY: number;
    currentColorIndex: number;
    nextColorIndex: number;
    colorChangeTime: number;
    clock: THREE.Clock;
    originalOrbPositions: Float32Array | null;
}

export default function CosmicOrb() {
    // Refs for the container and mutable state variables
    const mountRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<THREE.Points | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const state = useRef<StateType>({
        mouseX: 0,
        mouseY: 0,
        currentColorIndex: 0,
        nextColorIndex: 1,
        colorChangeTime: 0,
        clock: new THREE.Clock(),
        originalOrbPositions: null
    });

    // Memoized event handlers
    const handleMouseMove = useCallback((event: MouseEvent) => {
        state.current.mouseX = (event.clientX - window.innerWidth / 2);
        state.current.mouseY = (event.clientY - window.innerHeight / 2);
    }, []);

    // --- Main Three.js Setup and Animation Loop ---
    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // 1. Setup Three.js essentials
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.001);
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = CONFIG.cameraZ;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // 2. Orb Creation
        const sparkTexture = createDarkSparkTexture();
        const orbGeometry = new THREE.SphereGeometry(CONFIG.orbRadius, CONFIG.orbSegments, CONFIG.orbSegments);
        const orbMaterial = new THREE.PointsMaterial({
            color: GREEN_PALETTE[0],
            size: 0.15,
            map: sparkTexture,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const orb = new THREE.Points(orbGeometry, orbMaterial);
        scene.add(orb);
        orbRef.current = orb;

        if (orbGeometry.attributes.position) {
            const positions = orbGeometry.attributes.position.array;
            state.current.originalOrbPositions = new Float32Array(positions);
        }

        // 3. Event Listeners
        window.addEventListener('mousemove', handleMouseMove);
        
        const handleResize = () => {
            const width = currentMount.clientWidth;
            const height = currentMount.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // 4. Animation Loop
        const tempColor = new THREE.Color(); 
        const tempVector = new THREE.Vector3();

        const animate = () => {
            const { clock, originalOrbPositions } = state.current;
            const elapsedTime = clock.getElapsedTime();

            if (orbRef.current && originalOrbPositions) {
                const orb = orbRef.current;
                const orbGeometry = orb.geometry;
                const positionAttributeOrb = orbGeometry.attributes.position;

                // Color Cycle & Pulse
                const pulseLightness = 0.2 + Math.sin(elapsedTime * CONFIG.pulseSpeed) * 0.1;

                if (elapsedTime > state.current.colorChangeTime) {
                    state.current.currentColorIndex = state.current.nextColorIndex;
                    let newIndex = Math.floor(Math.random() * GREEN_PALETTE.length);
                    while (newIndex === state.current.currentColorIndex) {
                        newIndex = Math.floor(Math.random() * GREEN_PALETTE.length);
                    }
                    state.current.nextColorIndex = newIndex;
                    state.current.colorChangeTime = elapsedTime + COLOR_CHANGE_INTERVAL;
                }

                const targetBaseColor = GREEN_PALETTE[state.current.nextColorIndex];
                if (orb.material instanceof THREE.PointsMaterial) {
                    tempColor.copy(orb.material.color);
                    tempColor.lerp(targetBaseColor, CONFIG.colorCycleSpeed); 
                    
                    const hsl = { h: 0, s: 0, l: 0 };
                    tempColor.getHSL(hsl);
                    orb.material.color.setHSL(hsl.h, hsl.s, pulseLightness);
                }
                
                // Rotation
                orb.rotation.y += CONFIG.rotationSpeed;
                orb.rotation.z += CONFIG.rotationSpeed * 0.5;

                // Deformation
                const orbPositions = positionAttributeOrb.array as Float32Array;
                const count = positionAttributeOrb.count;
                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;
                    tempVector.set(originalOrbPositions[i3], originalOrbPositions[i3 + 1], originalOrbPositions[i3 + 2]);
                    tempVector.normalize();

                    const deformFactor = Math.sin(tempVector.x * 10 + elapsedTime * CONFIG.orbDeformSpeed + i * 0.1) * Math.cos(tempVector.y * 10 + elapsedTime * CONFIG.orbDeformSpeed + i * 0.1) * CONFIG.orbDeformIntensity;

                    const overallScale = CONFIG.baseScale + Math.sin(elapsedTime * CONFIG.pulseSpeed) * CONFIG.pulseMagnitude + deformFactor;

                    orbPositions[i3] = originalOrbPositions[i3] * overallScale;
                    orbPositions[i3 + 1] = originalOrbPositions[i3 + 1] * overallScale;
                    orbPositions[i3 + 2] = originalOrbPositions[i3 + 2] * overallScale;
                }
                positionAttributeOrb.needsUpdate = true;

                // Mouse Interaction
                const targetY = state.current.mouseY * 0.0005;
                orb.rotation.x += 0.05 * (targetY - orb.rotation.x);

                renderer.render(scene, camera);
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animate();

        // 5. Cleanup function
        return () => {
            if (animationFrameRef.current !== undefined) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            // Check if the element is still attached before removing
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            if (orbRef.current) {
                orbRef.current.geometry.dispose();
                if (orbRef.current.material instanceof THREE.Material) {
                    orbRef.current.material.dispose();
                }
                sparkTexture.dispose(); 
            }
            renderer.dispose();
        };
    }, [handleMouseMove]);

    // --- JSX Structure (with Tailwind) ---
    return (
        <div 
            ref={mountRef} 
            className="w-full h-80 overflow-hidden font-sans"
        >
            
        </div>
    );
}

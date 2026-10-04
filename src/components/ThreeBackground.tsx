import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
  className?: string;
  isInteractive?: boolean;
}

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export default function ThreeBackground({
  className = "",
  isInteractive = true,
}: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(() => !checkWebGLSupport());

  useEffect(() => {
    if (!checkWebGLSupport() || !containerRef.current || !canvasRef.current) {
      setHasWebGLError(true);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let animId: number;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      // 1. Scene & Camera Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        50
      );
      camera.position.set(0, 0, 8.5);

      // 2. WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      // 3. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
      mainLight.position.set(5, 8, 5);
      scene.add(mainLight);

      const cyanRimLight = new THREE.PointLight(0x64cefb, 3.5, 15);
      cyanRimLight.position.set(-6, 4, -2);
      scene.add(cyanRimLight);

      const indigoRimLight = new THREE.PointLight(0x4f46e5, 2.5, 15);
      indigoRimLight.position.set(7, -5, -3);
      scene.add(indigoRimLight);

      const centerGlow = new THREE.PointLight(0x38bdf8, 0.8, 8);
      centerGlow.position.set(0, 0, 2);
      scene.add(centerGlow);

      // 4. Object Creation
      const animables: { update: (t: number) => void }[] = [];

      // A. Metallic Rings
      const createRing = (
        pos: [number, number, number],
        scale = 1,
        color = 0x64cefb,
        speed = 0.5
      ) => {
        const group = new THREE.Group();
        group.position.set(...pos);
        group.scale.setScalar(scale);

        const torusGeo = new THREE.TorusGeometry(1.2, 0.03, 32, 100);
        const torusMat = new THREE.MeshPhysicalMaterial({
          color: 0x0d1117,
          emissive: color,
          emissiveIntensity: 0.2,
          metalness: 0.95,
          roughness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          reflectivity: 1.0,
        });
        const ringMesh = new THREE.Mesh(torusGeo, torusMat);
        group.add(ringMesh);

        const outerGeo = new THREE.TorusGeometry(1.2, 0.005, 16, 100);
        const outerMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.6,
        });
        const outerMesh = new THREE.Mesh(outerGeo, outerMat);
        outerMesh.scale.setScalar(1.02);
        group.add(outerMesh);

        scene.add(group);

        animables.push({
          update: (t: number) => {
            const st = t * speed;
            group.rotation.x = Math.sin(st * 0.3) * 0.15;
            group.rotation.y = st * 0.2;
            group.rotation.z = Math.cos(st * 0.2) * 0.1;
          },
        });
      };

      // Create Rings
      createRing([-3.5, 2.8, 0.5], 0.9, 0x64cefb, 0.3);
      createRing([-2.6, -2.8, 0.8], 0.75, 0x38bdf8, 0.35);
      createRing([3.2, -2.6, 0.6], 1.1, 0x64cefb, 0.25);
      createRing([0, 0.5, -2], 2.8, 0x1e3a8a, 0.1);

      // B. Glass Panels
      const createGlassPanel = (
        pos: [number, number, number],
        rot: [number, number, number],
        scale: [number, number, number],
        speed = 0.3
      ) => {
        const group = new THREE.Group();
        group.position.set(...pos);
        group.scale.set(...scale);

        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0x030712,
          transmission: 0.88,
          opacity: 1,
          transparent: true,
          roughness: 0.15,
          ior: 1.45,
          thickness: 0.6,
          reflectivity: 0.9,
          metalness: 0.1,
          clearcoat: 0.8,
        });
        const glassMesh = new THREE.Mesh(boxGeo, glassMat);
        group.add(glassMesh);

        scene.add(group);

        animables.push({
          update: (t: number) => {
            const st = t * speed;
            group.position.y = pos[1] + Math.sin(st) * 0.15;
            group.rotation.x = rot[0] + Math.sin(st * 0.5) * 0.05;
            group.rotation.y = rot[1] + Math.cos(st * 0.4) * 0.08;
          },
        });
      };

      createGlassPanel([-4.2, 2.2, -1], [0.3, 0.4, -0.2], [2.2, 3.2, 0.08], 0.25);
      createGlassPanel([4.2, -2.0, -0.8], [-0.2, -0.3, 0.15], [2.4, 2.8, 0.08], 0.22);

      // C. Wireframe Cubes
      const createWireframeCube = (
        pos: [number, number, number],
        scale = 1,
        speed = 0.25
      ) => {
        const group = new THREE.Group();
        group.position.set(...pos);
        group.scale.setScalar(scale);

        const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const edges = new THREE.EdgesGeometry(boxGeo);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35,
        });
        const wireframe = new THREE.LineSegments(edges, lineMat);
        group.add(wireframe);

        const coreGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x64cefb,
          emissive: 0x0284c7,
          emissiveIntensity: 0.8,
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        scene.add(group);

        animables.push({
          update: (t: number) => {
            const st = t * speed;
            group.rotation.x = st * 0.2;
            group.rotation.y = st * 0.3;
            group.rotation.z = Math.sin(st * 0.4) * 0.1;
          },
        });
      };

      createWireframeCube([4.0, 2.5, -0.5], 1.1, 0.2);
      createWireframeCube([-0.5, -0.8, -3], 2.2, 0.12);

      // D. Crystals (Dodecahedrons)
      const createCrystal = (
        pos: [number, number, number],
        scale = 0.8,
        color = 0x64cefb,
        speed = 0.4
      ) => {
        const geo = new THREE.DodecahedronGeometry(1, 0);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x080e1a,
          emissive: color,
          emissiveIntensity: 0.25,
          transmission: 0.6,
          opacity: 0.85,
          transparent: true,
          roughness: 0.1,
          metalness: 0.2,
          clearcoat: 1.0,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...pos);
        mesh.scale.setScalar(scale);
        scene.add(mesh);

        animables.push({
          update: (t: number) => {
            const st = t * speed;
            mesh.rotation.x = st * 0.3;
            mesh.rotation.y = st * 0.5;
            mesh.position.y = pos[1] + Math.cos(st * 0.8) * 0.12;
          },
        });
      };

      createCrystal([3.2, 1.5, 0.8], 0.7, 0x38bdf8, 0.35);
      createCrystal([-3.8, -2.2, 0.2], 0.85, 0x818cf8, 0.28);

      // E. Particles / Sparkles
      const particleCount = 100;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 16;
        positions[i + 1] = (Math.random() - 0.5) * 12;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }
      particleGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x64cefb,
        transparent: true,
        opacity: 0.5,
      });
      const particlePoints = new THREE.Points(particleGeo, particleMat);
      scene.add(particlePoints);

      animables.push({
        update: (t: number) => {
          particlePoints.rotation.y = t * 0.03;
        },
      });

      // 5. Mouse Interaction / Parallax
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const handleMouseMove = (e: MouseEvent) => {
        if (!isInteractive) return;
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      if (isInteractive) {
        window.addEventListener("mousemove", handleMouseMove, {
          passive: true,
        });
      }

      // 6. Resize Observer
      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // 7. Animation Loop
      const startTime = performance.now();
      const renderFrame = () => {
        animId = requestAnimationFrame(renderFrame);

        const elapsedTime = (performance.now() - startTime) / 1000;

        // Smooth camera lerp for mouse parallax
        if (isInteractive) {
          mouse.x += (mouse.targetX - mouse.x) * 0.035;
          mouse.y += (mouse.targetY - mouse.y) * 0.035;

          const floatY = Math.sin(elapsedTime * 0.5) * 0.15;
          const floatX = Math.cos(elapsedTime * 0.3) * 0.1;

          camera.position.x = mouse.x * 0.9 + floatX;
          camera.position.y = mouse.y * 0.6 + floatY + 0.2;
          camera.lookAt(0, 0, 0);
        }

        // Update all animated objects
        for (let i = 0; i < animables.length; i++) {
          animables[i].update(elapsedTime);
        }

        renderer.render(scene, camera);
      };

      renderFrame();

      // Cleanup function
      return () => {
        cancelAnimationFrame(animId);
        resizeObserver.disconnect();
        if (isInteractive) {
          window.removeEventListener("mousemove", handleMouseMove);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn("Failed initializing WebGL background:", err);
      setHasWebGLError(true);
    }
  }, [isInteractive]);

  const cssFallback = (
    <div
      className={`fixed inset-0 bg-[#000000] z-0 overflow-hidden pointer-events-none ${className}`}
    >
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[160px]" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );

  if (hasWebGLError) {
    return cssFallback;
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 bg-[#000000] z-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Ambient gradient backplate */}
      <div className="absolute top-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/8 blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[15%] w-[55vw] h-[55vw] rounded-full bg-indigo-600/8 blur-[180px] pointer-events-none z-0" />

      {/* Subtle Grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-60 z-0" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
    </div>
  );
}

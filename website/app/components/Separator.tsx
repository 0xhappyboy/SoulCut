"use client";
import { useTheme } from "../providers/ThemeProvider";
import { useEffect, useRef } from "react";
interface SeparatorProps {
  className?: string;
}
export default function Separator({ className = "" }: SeparatorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 0);
    let height = (canvas.height = 60);
    // Laser beam particles
    interface Beam {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
      width: number;
      phase: number;
    }
    const beams: Beam[] = [];
    const numBeams = 35;
    for (let i = 0; i < numBeams; i++) {
      beams.push({
        x: Math.random() * width,
        y: 5 + Math.random() * (height - 10),
        speed: 2.5 + Math.random() * 1.0,
        length: 40 + Math.random() * 60,
        opacity: 0.15 + Math.random() * 0.4,
        width: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    // Glow particles at beam ends
    interface Glow {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }
    const glows: Glow[] = [];
    const numGlows = 25;
    for (let i = 0; i < numGlows; i++) {
      glows.push({
        x: Math.random() * width,
        y: 5 + Math.random() * (height - 10),
        size: 2 + Math.random() * 4,
        opacity: 0.15 + Math.random() * 0.4,
        speed: 2.0 + Math.random() * 1.0,
      });
    }
    let animationId: number;
    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);
      // Update and draw beams
      for (const beam of beams) {
        beam.x += beam.speed;
        if (beam.x > width + 50) {
          beam.x = -50 - Math.random() * 80;
          beam.y = 5 + Math.random() * (height - 10);
          beam.speed = 2.5 + Math.random() * 1.0;
          beam.length = 40 + Math.random() * 60;
          beam.opacity = 0.15 + Math.random() * 0.4;
        }
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.05 + beam.phase);
        const currentOpacity = beam.opacity * pulse;
        // Black & White - use grayscale
        const alpha = currentOpacity;
        const white = isDark ? 255 : 0;
        // Draw beam - gradient from bright to transparent
        const grad = ctx.createLinearGradient(
          beam.x - beam.length,
          beam.y,
          beam.x,
          beam.y,
        );
        grad.addColorStop(0, `rgba(${white}, ${white}, ${white}, 0)`);
        grad.addColorStop(
          0.3,
          `rgba(${white}, ${white}, ${white}, ${alpha * 0.3})`,
        );
        grad.addColorStop(
          0.7,
          `rgba(${white}, ${white}, ${white}, ${alpha * 0.6})`,
        );
        grad.addColorStop(1, `rgba(${white}, ${white}, ${white}, ${alpha})`);
        ctx.beginPath();
        ctx.moveTo(beam.x - beam.length, beam.y);
        ctx.lineTo(beam.x, beam.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = beam.width;
        ctx.stroke();
        // Small glow at beam head
        const glowGrad = ctx.createRadialGradient(
          beam.x,
          beam.y,
          0,
          beam.x,
          beam.y,
          beam.width * 5,
        );
        glowGrad.addColorStop(
          0,
          `rgba(${white}, ${white}, ${white}, ${alpha * 0.5})`,
        );
        glowGrad.addColorStop(1, `rgba(${white}, ${white}, ${white}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(beam.x, beam.y, beam.width * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Draw glow particles
      for (const glow of glows) {
        glow.x += glow.speed;
        if (glow.x > width + 20) {
          glow.x = -20 - Math.random() * 40;
          glow.y = 5 + Math.random() * (height - 10);
          glow.speed = 2.0 + Math.random() * 1.0;
          glow.size = 2 + Math.random() * 4;
        }
        const pulse = 0.6 + 0.4 * Math.sin(time * 0.04 + glow.x * 0.02);
        const currentOpacity = glow.opacity * pulse;
        const white = isDark ? 255 : 0;
        const grad = ctx.createRadialGradient(
          glow.x,
          glow.y,
          0,
          glow.x,
          glow.y,
          glow.size * 4,
        );
        grad.addColorStop(
          0,
          `rgba(${white}, ${white}, ${white}, ${currentOpacity * 0.8})`,
        );
        grad.addColorStop(
          0.5,
          `rgba(${white}, ${white}, ${white}, ${currentOpacity * 0.3})`,
        );
        grad.addColorStop(1, `rgba(${white}, ${white}, ${white}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 60;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark]);
  return (
    <div className="relative w-full h-[60px] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}

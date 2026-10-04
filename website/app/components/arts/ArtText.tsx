import React, { useEffect, useState } from "react";

interface ArtTextProps {
  text: string;
  className?: string;
  fontSize?: number;
  fontWeight?: string | number;
  letterSpacing?: number;
  lightColor?: string;
  textColor?: string;
  animationDuration?: number;
  fontFamily?: string;
  glowSize?: number;
  align?: "left" | "center" | "right";
}

const ArtText: React.FC<ArtTextProps> = ({
  text,
  className = "",
  fontSize = 56,
  fontWeight = "300",
  letterSpacing = 2,
  lightColor = "#ffffff",
  textColor = "#818cf8",
  animationDuration = 3,
  fontFamily = "'Great Vibes', 'Sacramento', 'Dancing Script', cursive",
  glowSize = 0,
  align = "center",
}) => {
  const [viewWidth, setViewWidth] = useState(800);

  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById("art-text-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const width = Math.max(rect.width, 300);
        setViewWidth(width);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const gradId = `art-grad-${Math.random().toString(36).substr(2, 9)}`;
  const canvasHeight = fontSize * 1.1;
  const yPosition = fontSize * 0.85;

  const getTextX = () => {
    if (align === "left") return "0%";
    if (align === "right") return "100%";
    return "50%";
  };

  const getTextAnchor = () => {
    if (align === "left") return "start";
    if (align === "right") return "end";
    return "middle";
  };

  const getJustifyContent = () => {
    if (align === "left") return "flex-start";
    if (align === "right") return "flex-end";
    return "center";
  };

  return (
    <div
      id="art-text-container"
      className={`art-text-wrapper ${className}`}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: getJustifyContent(),
        alignItems: "center",
        background: "transparent",
      }}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${canvasHeight}`}
        style={{
          width: "100%",
          height: "auto",
          overflow: "visible",
          background: "transparent",
          display: "block",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 
            流光渐变：主体颜色 -> 高光颜色 -> 主体颜色
            textColor: 文字默认颜色（大部分区域的文字颜色）
            lightColor: 流光高光颜色（光带扫过时的颜色）
          */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={textColor} stopOpacity="1" />
            <stop offset="35%" stopColor={textColor} stopOpacity="1" />
            <stop offset="48%" stopColor={lightColor} stopOpacity="1" />
            <stop offset="52%" stopColor={lightColor} stopOpacity="1" />
            <stop offset="65%" stopColor={textColor} stopOpacity="1" />
            <stop offset="100%" stopColor={textColor} stopOpacity="1" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1.2 0"
              to="1.2 0"
              dur={`${animationDuration}s`}
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        <text
          x={getTextX()}
          y={yPosition}
          dominantBaseline="auto"
          textAnchor={getTextAnchor()}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontFamily={fontFamily}
          fill={`url(#${gradId})`}
          letterSpacing={letterSpacing}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

export default ArtText;

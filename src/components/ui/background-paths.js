// src/components/ui/background-paths.js
import React from 'react';
import { useTheme } from '../ParticleBackground';

function FloatingPaths({ position, theme }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1
        }}>
            <svg
                style={{
                    width: '100%',
                    height: '100%'
                }}
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <AnimatedPath
                        key={path.id}
                        path={path}
                        theme={theme}
                    />
                ))}
            </svg>
        </div>
    );
}

// Custom animated path component
function AnimatedPath({ path, theme }) {
    // For the login page left panel, we want white paths on blue background
    const strokeColor = 'rgba(255, 255, 255, 0.3)';
    const strokeOpacity = 0.15 + path.id * 0.015; // More subtle opacity
    
    return (
        <path
            d={path.d}
            stroke={strokeColor}
            strokeWidth={path.width}
            strokeOpacity={strokeOpacity}
            fill="none"
            style={{
                animation: `pathAnimation${path.id % 3} ${15 + (path.id % 10)}s linear infinite`,
                strokeDasharray: `${10 + (path.id % 5)} ${5 + (path.id % 3)}`,
                strokeDashoffset: '0'
            }}
        />
    );
}

export function BackgroundPaths({ children }) {
    const { theme } = useTheme();

    // Add CSS animations
    React.useEffect(() => {
        if (!document.getElementById('background-paths-styles')) {
            const style = document.createElement('style');
            style.id = 'background-paths-styles';
            style.textContent = `
                @keyframes pathAnimation0 {
                    0% {
                        stroke-dashoffset: 0;
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        stroke-dashoffset: -25;
                        opacity: 0.2;
                    }
                }
                
                @keyframes pathAnimation1 {
                    0% {
                        stroke-dashoffset: -10;
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.6;
                    }
                    100% {
                        stroke-dashoffset: -35;
                        opacity: 0.3;
                    }
                }
                
                @keyframes pathAnimation2 {
                    0% {
                        stroke-dashoffset: -5;
                        opacity: 0.25;
                    }
                    50% {
                        opacity: 0.55;
                    }
                    100% {
                        stroke-dashoffset: -30;
                        opacity: 0.25;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById('background-paths-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Background Paths */}
            <div style={{ position: 'absolute', inset: 0 }}>
                <FloatingPaths position={1} theme={theme} />
                <FloatingPaths position={-1} theme={theme} />
            </div>

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 5,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {children}
            </div>
        </div>
    );
}
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text, Icosahedron, Torus, Octahedron } from '@react-three/drei';

const FloatingShape = ({ position, color, type }) => {
    const mesh = useRef();

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.2;
        mesh.current.rotation.y += delta * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={mesh} position={position}>
                {type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
                {type === 'torus' && <torusGeometry args={[0.8, 0.2, 16, 32]} />}
                {type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
                <meshStandardMaterial color={color} wireframe />
            </mesh>
        </Float>
    );
};

const BackgroundScene = () => {
    return (
        <>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4facfe" />

            <FloatingShape position={[-4, 2, -5]} color="#4facfe" type="icosahedron" />
            <FloatingShape position={[4, -2, -5]} color="#a78bfa" type="torus" />
            <FloatingShape position={[0, -3, -8]} color="#10b981" type="octahedron" />
            <FloatingShape position={[-3, -3, -4]} color="#ec4899" type="torus" />
            <FloatingShape position={[5, 3, -6]} color="#f59e0b" type="icosahedron" />
        </>
    );
};

export const WelcomeScreen = ({ onStart }) => {
    const [hover, setHover] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* 3D Background */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#0f172a' }}>
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <BackgroundScene />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                pointerEvents: 'none' // Let clicks pass through if needed, but we need button interactions
            }}>
                <div className="glass-panel zoom-in" style={{
                    padding: '60px',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'auto', // Re-enable clicks
                    background: 'rgba(15, 23, 42, 0.4)', // More transparent
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>👋</div>

                    <h1 className="text-glow" style={{
                        fontSize: '3.5rem',
                        margin: '0 0 1rem 0',
                        fontWeight: '800',
                        lineHeight: 1.1,
                        background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Hand Gesture<br />3D Studio
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        color: '#cbd5e1',
                        marginBottom: '3rem',
                        lineHeight: '1.6',
                        maxWidth: '80%'
                    }}>
                        Experience the future of web interaction. Control 3D worlds efficiently with simple hand gestures.
                    </p>

                    <button
                        className="glass-button primary"
                        onClick={onStart}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        style={{
                            padding: '18px 56px',
                            fontSize: '1.3rem',
                            borderRadius: '100px',
                            boxShadow: hover ? '0 0 40px rgba(59, 130, 246, 0.7)' : '0 0 20px rgba(59, 130, 246, 0.4)',
                            transform: hover ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Start Experience
                    </button>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '20px', fontSize: '12px', opacity: 0.7 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>✋ Hand Tracking</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>🧊 3D Physics</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>🏃 Gamer Mode</span>
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    opacity: 0.6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Created By</p>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#60a5fa' }}>Ranjeet Kumar</h3>
                </div>
            </div>
        </div>
    );
};

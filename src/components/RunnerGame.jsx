import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Sky, Stars, useTexture } from '@react-three/drei';
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import { useGame } from '../store/GameContext';
import { Gestures } from '../logic/GestureRecognizer';
import { soundManager } from '../logic/SoundManager';
import characterImg from '../assets/character.png';
import enemyImg from '../assets/enemy.png';
import backgroundImg from '../assets/background.png';
import roadImg from '../assets/road.png';

const GROUND_SPEED = 12;
const JUMP_FORCE = 9;
const GRAVITY = 25;
const LANE_WIDTH = 8;

const ScrollingBackground = () => {
    const texture = useLoader(TextureLoader, backgroundImg);
    const mesh = useRef();

    useEffect(() => {
        texture.magFilter = NearestFilter; // Pixel art style
        texture.minFilter = NearestFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(2, 1);
    }, [texture]);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.material.map.offset.x += delta * 0.05; // Slower parallax
        }
    });

    return (
        <mesh ref={mesh} position={[0, 4, -15]} scale={[60, 20, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
};

const ScrollingRoad = () => {
    const texture = useLoader(TextureLoader, roadImg);
    const mesh = useRef();

    useEffect(() => {
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(1, 10); // Repeat vertically for the road
        // Rotate texture if needed, but easier to rotate mesh
    }, [texture]);

    useFrame((state, delta) => {
        if (mesh.current) {
            // Scroll Y because texture is mapped top-down
            mesh.current.material.map.offset.y -= delta * 0.5;
        }
    });

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            {/* Road width matches lane width approx, slightly wider for visuals */}
            <planeGeometry args={[12, 100]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

const Player = ({ gameState, setGameOver, score }) => {
    const mesh = useRef();
    const { handStateRef } = useGame();
    const playerPos = useRef({ x: 0, y: 0.6 });
    const velocity = useRef(0);
    const isJumping = useRef(false);

    // Cleanup BGM on unmount
    useEffect(() => {
        return () => soundManager.stopBGM();
    }, []);

    const texture = useLoader(TextureLoader, characterImg);

    // Ensure standard orientation for sprites
    texture.magFilter = NearestFilter;

    useFrame((state, delta) => {
        if (!mesh.current || gameState !== 'playing') return;

        const { position, gesture } = handStateRef.current;

        const targetX = position.x * (LANE_WIDTH / 2);
        playerPos.current.x += (targetX - playerPos.current.x) * 15 * delta;

        const isThumbUp = gesture === Gestures.THUMB_UP;
        const isHighHand = position.y < -0.4;

        if ((isThumbUp || isHighHand) && !isJumping.current) {
            velocity.current = JUMP_FORCE;
            isJumping.current = true;
            soundManager.playJump();
        }

        playerPos.current.y += velocity.current * delta;
        velocity.current -= GRAVITY * delta;

        if (playerPos.current.y <= 0.6) {
            playerPos.current.y = 0.6;
            velocity.current = 0;
            isJumping.current = false;
        }

        mesh.current.position.set(playerPos.current.x, playerPos.current.y, 0);
    });

    return (
        <sprite ref={mesh} position={[0, 0.6, 0]} scale={[1.2, 1.2, 1]}>
            <spriteMaterial map={texture} transparent={true} />
        </sprite>
    );
};

const Obstacle = ({ position }) => {
    const texture = useLoader(TextureLoader, enemyImg);
    texture.magFilter = NearestFilter;

    return (
        <sprite position={position} scale={[1, 1, 1]}>
            <spriteMaterial map={texture} transparent={true} />
        </sprite>
    );
}

const GameWorld = ({ gameState, setGameState, score, setScore }) => {
    const [obstacles, setObstacles] = useState([]);
    const lastSpawn = useRef(0);
    const { handStateRef } = useGame();

    // BGM Control
    useEffect(() => {
        if (gameState === 'playing') {
            soundManager.playBGM();
        } else {
            soundManager.stopBGM();
        }
    }, [gameState]);

    useFrame((state, delta) => {
        if (gameState !== 'playing') return;

        if (state.clock.elapsedTime - lastSpawn.current > 1.5) {
            lastSpawn.current = state.clock.elapsedTime;
            const newObstacle = {
                id: Date.now(),
                x: (Math.random() - 0.5) * (LANE_WIDTH - 2),
                z: -30
            };
            setObstacles(prev => [...prev, newObstacle]);
        }

        const playerX = handStateRef.current.position.x * (LANE_WIDTH / 2);

        setObstacles(prev => {
            let nextObstacles = [];
            let hit = false;

            prev.forEach(obs => {
                const newZ = obs.z + GROUND_SPEED * delta;

                if (Math.abs(newZ - 0) < 0.5) {
                    if (Math.abs(obs.x - playerX) < 1.0) {
                        hit = true;
                    }
                }

                if (newZ < 10) {
                    nextObstacles.push({ ...obs, z: newZ });
                }
            });

            if (hit) {
                setGameState('gameOver');
                soundManager.playGameOver();
            }

            return nextObstacles;
        });

        if (gameState === 'playing') {
            setScore(s => s + delta * 10);
        }
    });

    return (
        <>
            <ScrollingBackground />
            <Player gameState={gameState} score={score} setGameOver={() => setGameState('gameOver')} />
            <ScrollingRoad />
            {obstacles.map(obs => (
                <Obstacle key={obs.id} position={[obs.x, 0.5, obs.z]} />
            ))}

            {/* Ground plane for off-road area (Grass) if needed, or just void */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#2d4c1e" />
            </mesh>
        </>
    );
};

export const RunnerGame = () => {
    const [gameState, setGameState] = useState('waiting');
    const [score, setScore] = useState(0);
    const { isNight } = useGame();

    useEffect(() => {
        if (gameState === 'playing') {
            setScore(0);
        }
    }, [gameState]);

    return (
        <div style={{ width: '100vw', height: '100vh', background: isNight ? '#050510' : '#87CEEB', transition: 'background 1s ease' }}>
            <Canvas camera={{ position: [0, 3, 6], fov: 60 }} shadows>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />

                <React.Suspense fallback={null}>
                    {gameState !== 'waiting' && <GameWorld gameState={gameState} setGameState={setGameState} score={score} setScore={setScore} />}
                </React.Suspense>

                {gameState === 'waiting' && (
                    <React.Suspense fallback={null}>
                        <ScrollingBackground />
                        <ScrollingRoad />
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#2d4c1e" />
                        </mesh>
                    </React.Suspense>
                )}

            </Canvas>

            {gameState === 'playing' && (
                <div className="glass-panel" style={{
                    position: 'absolute',
                    top: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '8px 32px',
                    borderRadius: '30px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    zIndex: 10
                }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-warning)', textShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}>
                        {Math.floor(score)}
                    </span>
                </div>
            )}

            {gameState === 'waiting' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 20
                }}>
                    <div className="glass-panel popup-enter" style={{ textAlign: 'center', padding: '40px' }}>
                        <h1 className="text-glow" style={{ fontSize: '48px', marginBottom: '20px' }}>🏃 Ready to Run?</h1>
                        <p style={{ marginBottom: '30px', opacity: 0.8 }}>Use your hand to move Left/Right. <br />Thumb Up or Raise Hand to Jump!</p>
                        <button
                            className="glass-button primary"
                            style={{ padding: '15px 40px', fontSize: '20px', borderRadius: '50px' }}
                            onClick={() => {
                                soundManager.masterGain.gain.value = 0.3;
                                soundManager.playScore();
                                setGameState('playing');
                            }}
                        >
                            Start Running
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'gameOver' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20
                }}>
                    <div className="glass-panel popup-enter" style={{
                        padding: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                        <h1 style={{ fontSize: '56px', margin: 0, color: '#ef4444', textShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }}>CRASHED!</h1>
                        <p style={{ fontSize: '24px', opacity: 0.8 }}>Final Score: <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.floor(score)}</span></p>

                        <button
                            className="glass-button primary"
                            onClick={() => {
                                setScore(0);
                                setGameState('playing');
                            }}
                            style={{
                                marginTop: '10px',
                                padding: '16px 48px',
                                fontSize: '18px',
                                borderRadius: '30px'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

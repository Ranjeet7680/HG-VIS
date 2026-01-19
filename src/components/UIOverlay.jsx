import React from 'react';
import { useGame } from '../store/GameContext';

export const UIOverlay = () => {
    const {
        handStateRef,
        objects,
        selectedId,
        setSelectedId,
        creationSettings,
        setCreationSettings,
        gameMode,
        setGameMode,
        updateObject,
        deleteObject,
        isNight,
        setIsNight
    } = useGame();

    const [gesture, setGesture] = React.useState('NONE');

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (handStateRef.current) {
                setGesture(handStateRef.current.gesture);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [handStateRef]);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '24px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            {/* Top Bar Container */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                {/* Left: Controls Panel */}
                <div className="glass-panel slide-in-left" style={{ padding: '24px', width: '300px', pointerEvents: 'auto' }}>
                    <h2 style={{
                        margin: '0 0 16px 0',
                        fontSize: '18px',
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '24px' }}>🎮</span> Controls
                    </h2>

                    <ul style={{
                        paddingLeft: '0',
                        listStyle: 'none',
                        margin: 0,
                        fontSize: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {gameMode === 'creative' ? (
                            <>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>✋</span>
                                    <span><b>Open Palm</b>: Create Object</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>☝️</span>
                                    <span><b>One Finger</b>: Move (X, Y)</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>✌️</span>
                                    <span><b>Two Fingers</b>: Rotate</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>🤟</span>
                                    <span><b>Three Fingers</b>: Scale</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>👍</span>
                                    <span><b>Thumb Up</b>: Change Color</span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>☝️</span>
                                    <span><b>One Finger</b>: Move Left/Right</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>👍</span>
                                    <span><b>Thumb Up</b>: Jump</span>
                                </li>
                            </>
                        )}
                    </ul>

                    <button
                        className="glass-button primary"
                        onClick={() => setGameMode(prev => prev === 'creative' ? 'runner' : 'creative')}
                        style={{
                            marginTop: '24px',
                            width: '100%',
                            padding: '12px',
                        }}
                    >
                        {gameMode === 'creative' ? '🏃 Play Runner Mode' : '🎨 Back to Creative'}
                    </button>
                </div>

                {/* Right: Status Panel */}
                <div className="glass-panel slide-in-right" style={{ padding: '20px 30px', textAlign: 'right', pointerEvents: 'auto' }}>
                    <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '4px' }}>
                        Current Gesture
                    </div>
                    <div className="text-glow" style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: 'var(--accent-primary)',
                        marginBottom: '16px'
                    }}>
                        {gesture.replace('_', ' ')}
                    </div>

                    {gameMode === 'creative' && (
                        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '16px' }}>
                            Objects: {objects.length} | Selected: {selectedId || 'None'}
                        </div>
                    )}

                    <button
                        className="glass-button"
                        onClick={() => setIsNight(prev => !prev)}
                        style={{
                            padding: '8px 16px',
                            fontSize: '13px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {isNight ? '🌙 Night Mode' : '☀️ Day Mode'}
                    </button>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>

                {/* Center Warning */}
                <div className="glass-panel" style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '0',
                    transform: 'translateX(-50%)',
                    padding: '10px 24px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    opacity: 0.9,
                    pointerEvents: 'none'
                }}>
                    Ensure your hand is visible for tracking
                </div>

                {/* Right: Creative Tools */}
                {gameMode === 'creative' && (
                    <div className="glass-panel slide-in-right" style={{
                        padding: '24px',
                        pointerEvents: 'auto',
                        width: '240px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                            🛠️ Creation Tools
                        </h3>

                        {/* Shape */}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', opacity: 0.8 }}>Shape</label>
                            <select
                                style={{ width: '100%' }}
                                value={creationSettings.type}
                                onChange={(e) => setCreationSettings(prev => ({ ...prev, type: e.target.value }))}
                            >
                                <option value="box">Cube</option>
                                <option value="sphere">Sphere</option>
                                <option value="cylinder">Cylinder</option>
                                <option value="cone">Cone</option>
                                <option value="rectangle">Rectangle</option>
                            </select>
                        </div>

                        {/* Material */}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', opacity: 0.8 }}>Material</label>
                            <select
                                style={{ width: '100%' }}
                                value={creationSettings.material}
                                onChange={(e) => setCreationSettings(prev => ({ ...prev, material: e.target.value }))}
                            >
                                <option value="plastic">Plastic</option>
                                <option value="metal">Metal</option>
                                <option value="rubber">Rubber</option>
                            </select>
                        </div>

                        {/* Color */}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', opacity: 0.8 }}>Color</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#ffffff', '#8b5cf6', '#06b6d4', '#ec4899'].map(c => (
                                    <div
                                        key={c}
                                        onClick={() => setCreationSettings(prev => ({ ...prev, color: c }))}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            background: c,
                                            borderRadius: '50%',
                                            border: creationSettings.color === c ? '2px solid white' : '2px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            transform: creationSettings.color === c ? 'scale(1.2)' : 'scale(1)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modify Object Popup */}
            {selectedId && (
                <div className="glass-panel popup-enter" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '24px',
                    pointerEvents: 'auto',
                    minWidth: '320px',
                    zIndex: 100,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>✨ Modify Object</h3>
                        <button
                            onClick={() => setSelectedId(null)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {objects.find(o => o.id === selectedId) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Color */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', opacity: 0.8 }}>Color</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={objects.find(o => o.id === selectedId).color}
                                        onChange={(e) => updateObject(selectedId, { color: e.target.value })}
                                        style={{
                                            width: '50px',
                                            height: '40px',
                                            padding: 0,
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: 'none'
                                        }}
                                    />
                                    <span style={{ fontSize: '12px', opacity: 0.6 }}>Pick a custom color</span>
                                </div>
                            </div>

                            {/* Material */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', opacity: 0.8 }}>Material</label>
                                <select
                                    value={objects.find(o => o.id === selectedId).material || 'plastic'}
                                    onChange={(e) => updateObject(selectedId, { material: e.target.value })}
                                    style={{ width: '100%' }}
                                >
                                    <option value="plastic">Plastic</option>
                                    <option value="metal">Metal</option>
                                    <option value="rubber">Rubber</option>
                                </select>
                            </div>

                            {/* Delete */}
                            <button
                                className="glass-button danger"
                                onClick={() => deleteObject(selectedId)}
                                style={{
                                    marginTop: '10px',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>🗑️</span> Delete Object
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.6, padding: '20px' }}>Object lost in space...</div>
                    )}
                </div>
            )}
        </div >
    );
};

import React, { useEffect, useRef } from 'react';
import { HandTracker } from '../logic/HandTracker';
import { GestureRecognizer, Gestures } from '../logic/GestureRecognizer';
import { useGame } from '../store/GameContext';

export const HandController = () => {
    const videoRef = useRef(null);
    const trackerRef = useRef(null);
    const { handStateRef, debugMode, addObject, selectedId, updateObject, objects, updateSelectedObjectCallback } = useGame();

    // Improving responsiveness: Track previous gesture to debounce or detect transitions
    const lastGestureRef = useRef('NONE');
    const gestureStartTimeRef = useRef(0);

    // FIX: Stale Closure Issue. 
    // The MediaPipe callback is initialized once, so it captures 'addObject' from the first render.
    // 'addObject' changes when 'creationSettings' changes.
    // We use a ref to always point to the latest 'addObject' function.
    const addObjectRef = useRef(addObject);
    const updateObjectRef = useRef(updateObject);
    const selectedIdRef = useRef(selectedId);

    // Update refs whenever props/context change
    useEffect(() => {
        addObjectRef.current = addObject;
        updateObjectRef.current = updateObject;
        selectedIdRef.current = selectedId;
    }, [addObject, updateObject, selectedId]);

    // Smoothing
    const previousPositionRef = useRef({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        if (!videoRef.current) return;

        trackerRef.current = new HandTracker();

        trackerRef.current.initialize(videoRef.current, (results) => {
            const landmarks = results.multiHandLandmarks ? results.multiHandLandmarks[0] : null;

            if (landmarks) {
                const gesture = GestureRecognizer.predict(landmarks);

                // Update Ref for other components
                handStateRef.current.landmarks = landmarks;
                handStateRef.current.gesture = gesture;

                // Index Tip: 8
                const indexTip = landmarks[8];

                // Raw Target
                const targetX = (1 - indexTip.x) * 2 - 1;
                const targetY = -(indexTip.y * 2 - 1);

                // LERP for Smoothing (Factor 0.2 = fast but smooth)
                const alpha = 0.2;
                const smoothedX = previousPositionRef.current.x + (targetX - previousPositionRef.current.x) * alpha;
                const smoothedY = previousPositionRef.current.y + (targetY - previousPositionRef.current.y) * alpha;

                previousPositionRef.current = { x: smoothedX, y: smoothedY, z: 0 };

                handStateRef.current.position = {
                    x: smoothedX,
                    y: smoothedY,
                    z: 0
                };

                // Pass refs instead of direct functions
                handleGestureActions(gesture, handStateRef.current.position, addObjectRef.current, updateObjectRef.current, selectedIdRef.current);
            } else {
                handStateRef.current.gesture = 'NONE';
            }
        });

        trackerRef.current.start();

        return () => {
            if (trackerRef.current) trackerRef.current.stop();
        };
    }, []);

    const handleGestureActions = (gesture, position, addObjectFn, updateObjectFn, currentSelectedId) => {
        const now = Date.now();

        // Creation Logic (Open Palm) - Faster, Snappier Debounce (300ms)
        if (gesture === Gestures.OPEN_PALM) {
            if (lastGestureRef.current !== Gestures.OPEN_PALM) {
                // Trigger creation on entry
                if (now - gestureStartTimeRef.current > 300) {
                    addObjectFn(); // Uses latest ref
                }
            }
        }

        // Color Change (Thumb Up)
        if (gesture === Gestures.THUMB_UP) {
            if (lastGestureRef.current !== Gestures.THUMB_UP) {
                // Change color of selected object
                if (currentSelectedId) {
                    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff', '#ff00ff'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    updateObjectFn(currentSelectedId, { color: randomColor });
                }
            }
        }

        // Action Mapping for Selection/Movement integration happens in the Scene Loop
        // but we can also do reliable state updates here.

        if (gesture !== lastGestureRef.current) {
            lastGestureRef.current = gesture;
            gestureStartTimeRef.current = now;
        }
    };

    return (
        <div
            className="glass-panel slide-in-left"
            style={{
                position: 'fixed',
                bottom: '24px',
                left: '24px',
                opacity: debugMode ? 1 : 0,
                pointerEvents: 'none',
                zIndex: 50,
                padding: '12px',
                transition: 'opacity 0.3s, transform 0.3s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}
        >
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <video
                    ref={videoRef}
                    style={{
                        width: '240px',
                        height: '135px',
                        transform: 'scaleX(-1)',
                        display: 'block',
                        objectFit: 'cover'
                    }}
                    playsInline
                />
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(239, 68, 68, 0.8)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                }} />
            </div>

            <div style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '11px',
                textAlign: 'center',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
            }}>
                Camera Feed
            </div>
        </div>
    );
};

import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    // High-frequency state (mutable refs) for loop access
    const handStateRef = useRef({
        landmarks: [],
        gesture: 'NONE',
        position: { x: 0, y: 0, z: 0 }
    });

    // React state for UI and slower updates
    const [objects, setObjects] = useState([]); // { id, type, position, rotation, scale, color, material }
    const [selectedId, setSelectedId] = useState(null);
    const [debugMode, setDebugMode] = useState(true);

    // New: Settings for next object creation
    const [creationSettings, setCreationSettings] = useState({
        type: 'box',
        color: '#ffffff',
        material: 'plastic'
    });

    const [gameMode, setGameMode] = useState('creative'); // 'creative' | 'runner'
    const [isNight, setIsNight] = useState(false);

    const addObject = useCallback(() => {
        const { type, color, material } = creationSettings;

        let initialScale = [1, 1, 1];
        if (type === 'rectangle') {
            initialScale = [1.5, 0.75, 0.75]; // Distinct shape for rectangle/cuboid
        }

        const newObj = {
            id: Date.now(),
            type: type === 'rectangle' ? 'box' : type, // Rectangle is just a scaled box
            isRectangle: type === 'rectangle', // Flag to preserve identity if needed
            position: [0, 0, 0], // Could randomize slightly?
            rotation: [0, 0, 0],
            scale: initialScale,
            color,
            material
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedId(newObj.id);
    }, [creationSettings]);

    const updateObject = useCallback((id, updates) => {
        setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
    }, []);

    const deleteObject = useCallback((id) => {
        setObjects(prev => prev.filter(obj => obj.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
        }
    }, [selectedId]);

    // For direct manipulation in loop without re-renders
    const updateSelectedObjectCallback = useRef(null);

    return (
        <GameContext.Provider value={{
            handStateRef,
            objects,
            setObjects,
            selectedId,
            setSelectedId,
            addObject,
            updateObject,
            deleteObject,
            debugMode,
            setDebugMode,
            updateSelectedObjectCallback,
            creationSettings,
            setCreationSettings,
            gameMode,
            setGameMode,
            isNight,
            setIsNight
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);

import React, { useState } from 'react';
import { GameProvider } from './store/GameContext';
import { Scene } from './components/Scene';
import { HandController } from './components/HandController';
import { UIOverlay } from './components/UIOverlay';
import { WelcomeScreen } from './components/WelcomeScreen';

import { RunnerGame } from './components/RunnerGame';
import { useGame } from './store/GameContext';

const GameContent = ({ started, setStarted }) => {
    const { gameMode } = useGame();

    if (!started) {
        return <WelcomeScreen onStart={() => setStarted(true)} />;
    }

    return (
        <>
            {gameMode === 'runner' ? <RunnerGame /> : <Scene />}
            <HandController />
            <UIOverlay />
        </>
    );
};

function App() {
    const [started, setStarted] = useState(false);

    return (
        <GameProvider>
            <div className="app-container">
                <GameContent started={started} setStarted={setStarted} />
            </div>
        </GameProvider>
    )
}

export default App

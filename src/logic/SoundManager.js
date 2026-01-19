class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = 0.3; // Volume
        this.masterGain.connect(this.context.destination);
        this.bgmOscillators = [];
        this.isPlayingBGM = false;
        this.tempo = 0.15; // Speed of notes
        this.nextNoteTime = 0;
        this.melody = [
            // Simple catchy arpeggio pattern
            261.63, 329.63, 392.00, 523.25, // C E G C
            392.00, 329.63, 261.63, 196.00, // G E C G_low
            220.00, 261.63, 329.63, 440.00, // A C E A
            329.63, 261.63, 220.00, 196.00  // E C A G_low
        ];
        this.currentNoteIndex = 0;
        this.timerID = null;
    }

    playTone(freq, type, duration, time = this.context.currentTime) {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);

        // Envelope
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration - 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + duration);
    }

    scheduleNote() {
        const secondsPerBeat = this.tempo;

        // Schedule slightly ahead
        while (this.nextNoteTime < this.context.currentTime + 0.1) {
            const freq = this.melody[this.currentNoteIndex];

            // Harmony (Bass)
            this.playTone(freq / 2, 'square', secondsPerBeat, this.nextNoteTime);
            // Melody
            this.playTone(freq, 'triangle', secondsPerBeat * 0.8, this.nextNoteTime);

            this.nextNoteTime += secondsPerBeat;
            this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
        }

        if (this.isPlayingBGM) {
            this.timerID = setTimeout(() => this.scheduleNote(), 25);
        }
    }

    playBGM() {
        if (this.isPlayingBGM) return;

        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        this.isPlayingBGM = true;
        this.currentNoteIndex = 0;
        this.nextNoteTime = this.context.currentTime;
        this.scheduleNote();
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.timerID) {
            clearTimeout(this.timerID);
            this.timerID = null;
        }
    }

    playJump() {
        this.playTone(400, 'sine', 0.1);
        setTimeout(() => this.playTone(600, 'sine', 0.1), 50);
    }

    playScore() {
        this.playTone(800, 'sine', 0.1);
        setTimeout(() => this.playTone(1200, 'triangle', 0.1), 50);
    }

    playGameOver() {
        this.stopBGM(); // Cut music on death
        this.playTone(200, 'sawtooth', 0.5);
        setTimeout(() => this.playTone(150, 'sawtooth', 0.5), 200);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.8), 400);
    }
}

export const soundManager = new SoundManager();

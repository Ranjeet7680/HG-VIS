# HG-VIS 🖐️🎯  
### Hand Gesture – Virtual Interaction System

HG-VIS is a computer vision–based system that allows users to control mouse and system-level interactions using **hand gestures captured via a webcam**.  
This project is designed with **Google Summer of Code (GSoC)** standards in mind and targets the **OpenCV** ecosystem.

---

## 🚀 Project Overview

Traditional input devices like mouse and keyboard are not always intuitive or accessible.  
HG-VIS provides a **touchless, real-time, and low-latency virtual interaction system** using hand gesture recognition.

The system works with a standard webcam and does not require any external hardware.

---

## 🎯 Key Features

- Real-time hand landmark detection  
- Gesture-based mouse movement  
- Left & right click control  
- Scroll and zoom gestures  
- Volume and window control  
- Lightweight and cross-platform  

---

## 🛠️ Tech Stack

- **Python**
- **OpenCV**
- **MediaPipe**
- **NumPy**
- **PyAutoGUI**
- (Optional) OS-specific system APIs

---

## 🧠 How It Works

1. Webcam captures video frames  
2. Frames processed using OpenCV  
3. Hand landmarks detected via MediaPipe  
4. Gestures classified using rule-based logic / ML  
5. Gestures mapped to system actions  
6. Actions executed in real time  

---

## ✋ Planned Gesture Mapping

| Gesture | Action |
|------|------|
| Index finger movement | Mouse movement |
| Index + Thumb pinch | Left click |
| Two fingers | Right click |
| Open palm | Scroll |
| Pinch in / out | Zoom |
| Fist | Lock / pause control |

---

## 📅 GSoC Timeline (Proposed)

### Community Bonding Period
- Study OpenCV codebase
- Review existing hand-tracking solutions
- Finalize architecture and gesture set

### Phase 1
- Implement hand landmark detection
- Basic gesture recognition

### Phase 2
- System control integration
- Performance & accuracy optimization

### Final Phase
- Testing & benchmarking
- Documentation
- Demo video and final evaluation

---

## 🧪 Installation (Prototype)

```bash
git clone https://github.com/your-username/HG-VIS.git
cd HG-VIS
pip install -r requirements.txt
python main.py
# HG-VIS

# Space Weather Dashboard 🌞⚡🛰️

## Overview
The Space Weather Dashboard is an interactive 3D visualization platform that simulates solar weather events and their impact on Earth's satellite infrastructure. Built for real-time monitoring and educational purposes, it provides an immersive experience for understanding space weather phenomena.

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript for robust component architecture
- **React Three Fiber** for high-performance 3D rendering
- **Three.js** for 3D graphics and animations
- **Tailwind CSS** with custom design system for space-themed UI
- **shadcn/ui** components for consistent interface elements
- **Lucide React** for iconography

### Styling & Design
- **Custom CSS Variables** for HSL-based color theming
- **Gradient System** with solar, earth, and space-themed palettes
- **Animation Framework** with orbital mechanics and glow effects
- **Responsive Design** optimized for large displays and presentations

## 🎯 Core Features

### 1. **3D Solar System Visualization**
**What it offers:**
- Real-time 3D representation of Sun, Earth, and satellite constellation
- Physically-inspired orbital mechanics with smooth animations
- Interactive camera controls (zoom, pan, rotate)
- Visual depth with starfield background and atmospheric effects

**How to read:**
- **Golden sphere**: The Sun with animated solar flares
- **Blue sphere**: Earth with rotating atmosphere and orbital path
- **Small colored dots**: Individual satellites in various orbits
- **Orange cone**: Coronal Mass Ejection (CME) expanding from the Sun

### 2. **CME Impact Detection System**
**What it offers:**
- Real-time geometric collision detection between CME cone and satellite positions
- Severity classification (High/Medium/Low) based on satellite altitude and exposure
- Predictive impact timing with countdown displays
- Visual highlighting of at-risk satellites

**How to read:**
- **Left panel table**: Lists all satellites in the CME path
- **Red badges**: High-severity impacts (low-altitude satellites)
- **Yellow badges**: Medium-severity impacts 
- **Time displays**: Hours until CME reaches each satellite
- **Pulsing animations**: Indicate active threats

### 3. **Interactive Timeline Controls**
**What it offers:**
- Play/pause simulation with real-time progression
- Manual time scrubbing via slider control
- Quick navigation (reset, fast-forward)
- Time marker system showing T-12h to T+12h range

**How to read:**
- **Play/Pause button**: Controls simulation state
- **Time slider**: Drag to jump to specific time points
- **Current time display**: Shows simulation timestamp
- **Timeline markers**: Reference points for event timing

### 4. **AI-Powered Space Weather Assistant**
**What it offers:**
- Context-aware responses about current space weather conditions
- Real-time data integration from simulation state
- Educational explanations of space weather phenomena
- Safety disclaimers for official information sources

**How to read:**
- **Right panel chat**: Interactive Q&A interface
- **Conversation flow**: Ask questions about current conditions
- **Data-grounded responses**: Answers reflect actual simulation state
- **Fallback guidance**: Directs to NOAA SWPC for official alerts

### 5. **Satellite Details Panel**
**What it offers:**
- Comprehensive satellite metadata on selection
- Orbital parameters and mission information
- Real-time position data
- Operator and launch details

**How to read:**
- **Click any satellite**: Opens detailed information panel
- **Orbital data**: Altitude, inclination, period
- **Position coordinates**: Real-time latitude/longitude
- **Status indicators**: Color-coded operational state

## 📊 How to Interpret the Visualization

### Spatial Relationships
- **Scale**: Logarithmic scaling for visibility (actual distances would make satellites invisible)
- **Orbits**: Different satellite altitudes shown as distinct orbital shells
- **CME Propagation**: Cone expands from Sun toward Earth at realistic speeds

### Color Coding System
- **🟡 Solar elements**: Golden/yellow for Sun and solar phenomena
- **🔵 Earth elements**: Blue/cyan for Earth and terrestrial references  
- **🟠 CME elements**: Orange/red for coronal mass ejections
- **🟢 Safe satellites**: Green indicators for unaffected spacecraft
- **🔴 Impacted satellites**: Red/orange for spacecraft in CME path

### Animation Cues
- **Orbital motion**: Satellites follow realistic orbital mechanics
- **CME expansion**: Cone grows at proportional solar wind speeds
- **Pulsing effects**: Indicate active alerts or selected objects
- **Glow effects**: Highlight important elements and interactions

## 🎮 User Interaction Guide

### Navigation
1. **Camera Control**: Click and drag to rotate view, scroll to zoom
2. **Satellite Selection**: Click on any satellite for detailed information
3. **Timeline Control**: Use bottom panel to control simulation time
4. **AI Assistant**: Ask questions in the right-panel chat

### Key Workflows
1. **Monitor Current Conditions**: Check impact detection table for active threats
2. **Explore Scenarios**: Use timeline to see CME evolution over time
3. **Investigate Satellites**: Click spacecraft to understand their missions
4. **Learn More**: Ask the AI assistant about space weather effects

## 🏆 Hackathon Differentiators

### Technical Innovation
- **Real-time 3D Physics**: Proper orbital mechanics with CME propagation modeling
- **Geometric Collision Detection**: Advanced algorithms for impact prediction
- **Performance Optimization**: Smooth 60fps rendering with hundreds of objects

### User Experience
- **Intuitive Interface**: Complex data presented through engaging 3D metaphors
- **Educational Value**: Learn space weather through interactive exploration
- **Professional Polish**: Production-ready UI with comprehensive theming

### Practical Applications
- **Mission Planning**: Visualize satellite vulnerability during solar events
- **Educational Tool**: Teach space weather concepts through immersive experience
- **Risk Assessment**: Understand infrastructure exposure to space weather

## ⚠️ Important Disclaimer
This application is designed for educational and demonstration purposes only. For official space weather alerts, warnings, and operational guidance, please refer to NOAA's Space Weather Prediction Center (SWPC) at spaceweather.gov.

---

*Built with ❤️ for space weather awareness and satellite infrastructure protection*
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Sphere, Ring } from "@react-three/drei";
import * as THREE from "three";

// Sun component with solar flare visualization
const Sun = ({ isPlaying }: { isPlaying: boolean }) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.01;
    }
    
    if (flareRef.current && isPlaying) {
      // Animate solar flare intensity
      const intensity = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      flareRef.current.scale.setScalar(intensity);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun core */}
      <Sphere ref={sunRef} args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#FF6B35" />
      </Sphere>
      
      {/* Solar atmosphere/corona */}
      <Sphere ref={flareRef} args={[2.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#FFB347" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Sun label */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#FFB347"
        anchorX="center"
        anchorY="middle"
      >
        SUN
      </Text>
    </group>
  );
};

// Earth component with orbital mechanics
const Earth = ({ isPlaying }: { isPlaying: boolean }) => {
  const earthRef = useRef<THREE.Group>(null);
  const [orbitAngle, setOrbitAngle] = useState(0);

  useFrame(() => {
    if (isPlaying && earthRef.current) {
      setOrbitAngle((prev) => prev + 0.002);
      earthRef.current.position.x = Math.cos(orbitAngle) * 15;
      earthRef.current.position.z = Math.sin(orbitAngle) * 15;
      earthRef.current.rotation.y += 0.05;
    }
  });

  return (
    <group ref={earthRef} position={[15, 0, 0]}>
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial color="#4A90E2" />
      </Sphere>
      
      {/* Earth's atmosphere */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.2}
        />
      </Sphere>

      <Text
        position={[0, 2, 0]}
        fontSize={0.4}
        color="#4A90E2"
        anchorX="center"
        anchorY="middle"
      >
        EARTH
      </Text>
    </group>
  );
};

// CME visualization
const CME = ({ isPlaying }: { isPlaying: boolean }) => {
  const cmeRef = useRef<THREE.Mesh>(null);
  const [expansion, setExpansion] = useState(1);

  useFrame(() => {
    if (isPlaying && cmeRef.current) {
      setExpansion((prev) => Math.min(prev + 0.05, 10));
      cmeRef.current.scale.setScalar(expansion);
      
      // Fade out as it expands
      const material = cmeRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0.1, 1 - expansion / 10);
    }
  });

  return (
    <mesh ref={cmeRef} position={[0, 0, 0]}>
      <coneGeometry args={[3, 8, 8]} />
      <meshBasicMaterial 
        color="#FF4444" 
        transparent 
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Satellite constellation
const Satellites = ({ 
  isPlaying, 
  onSatelliteClick,
  selectedSatelliteId 
}: { 
  isPlaying: boolean;
  onSatelliteClick: (satellite: any) => void;
  selectedSatelliteId: string | null;
}) => {
  const satellites = Array.from({ length: 8 }, (_, i) => ({
    id: `SAT-${i + 1}`,
    distance: 12 + Math.random() * 6,
    angle: (i / 8) * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.02,
    name: `SAT-${i + 1}`,
    operator: ["NASA", "ESA", "SpaceX", "CNSA", "ISRO", "JAXA", "Roscosmos", "Commercial"][i],
    altitude: Math.round(400 + Math.random() * 35000),
    orbitType: i < 3 ? "LEO" : i < 6 ? "MEO" : "GEO",
    launchDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    status: ["operational", "operational", "operational", "degraded", "operational", "operational", "operational", "inactive"][i] as "operational" | "degraded" | "inactive",
    velocity: 7.8 + Math.random() * 3.2
  }));

  return (
    <>
      {satellites.map((sat) => (
        <Satellite 
          key={sat.id} 
          satellite={sat} 
          isPlaying={isPlaying}
          onClick={onSatelliteClick}
          isSelected={selectedSatelliteId === sat.id}
        />
      ))}
    </>
  );
};

const Satellite = ({ 
  satellite, 
  isPlaying,
  onClick,
  isSelected
}: { 
  satellite: any; 
  isPlaying: boolean;
  onClick: (satellite: any) => void;
  isSelected: boolean;
}) => {
  const satRef = useRef<THREE.Group>(null);
  const [angle, setAngle] = useState(satellite.angle);

  useFrame(() => {
    if (isPlaying && satRef.current) {
      setAngle((prev) => prev + satellite.speed);
      satRef.current.position.x = Math.cos(angle) * satellite.distance;
      satRef.current.position.z = Math.sin(angle) * satellite.distance;
    }
  });

  const handleClick = () => {
    const position = {
      x: Math.cos(angle) * satellite.distance * 1000, // Convert to km
      y: 0,
      z: Math.sin(angle) * satellite.distance * 1000
    };
    
    onClick({
      ...satellite,
      position
    });
  };

  return (
    <group ref={satRef} onClick={handleClick}>
      <Sphere args={[isSelected ? 0.15 : 0.1, 8, 8]}>
        <meshBasicMaterial color={isSelected ? "#FFD700" : "#C0C0C0"} />
      </Sphere>
      
      {isSelected && (
        <Sphere args={[0.2, 8, 8]}>
          <meshBasicMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.3}
          />
        </Sphere>
      )}
      
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color={isSelected ? "#FFD700" : "#C0C0C0"}
        anchorX="center"
        anchorY="middle"
      >
        {satellite.name}
      </Text>
    </group>
  );
};

interface SolarSystem3DProps {
  isPlaying: boolean;
  currentTime: Date;
  onSatelliteClick: (satellite: any) => void;
  selectedSatelliteId: string | null;
  onImpactedSatellitesChange: (satellites: any[]) => void;
}

export const SolarSystem3D = ({ 
  isPlaying, 
  currentTime, 
  onSatelliteClick, 
  selectedSatelliteId,
  onImpactedSatellitesChange 
}: SolarSystem3DProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [20, 15, 20], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FFB347" />
        
        <Stars 
          radius={200} 
          depth={50} 
          count={2000} 
          factor={4} 
          saturation={0} 
          fade 
        />
        
        {/* Solar system components */}
        <Sun isPlaying={isPlaying} />
        <Earth isPlaying={isPlaying} />
        <CME isPlaying={isPlaying} />
        <Satellites 
          isPlaying={isPlaying}
          onSatelliteClick={onSatelliteClick}
          selectedSatelliteId={selectedSatelliteId}
        />
        
        {/* Earth orbit ring */}
        <Ring args={[14.8, 15.2, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial 
            color="#4A90E2" 
            transparent 
            opacity={0.1} 
            side={THREE.DoubleSide}
          />
        </Ring>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
        />
      </Canvas>
    </div>
  );
};
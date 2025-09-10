import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolarSystem3D } from "./SolarSystem3D";
import { TimelineControls } from "./TimelineControls";
import { ChatPanel } from "./ChatPanel";
import { ImpactDetectionTable } from "./ImpactDetectionTable";
import { SatelliteDetailsPanel } from "./SatelliteDetailsPanel";
import { Play, Pause, AlertTriangle } from "lucide-react";

export const SpaceWeatherDashboard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cmeActive, setCmeActive] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<any>(null);
  const [impactedSatellites, setImpactedSatellites] = useState<any[]>([]);

  // Mock impact detection logic
  useEffect(() => {
    const mockImpactedSats = [
      {
        id: "SAT-3",
        name: "SAT-3",
        operator: "SpaceX",
        altitude: 12500,
        impactTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
        severity: "high" as const
      },
      {
        id: "SAT-5",
        name: "SAT-5",
        operator: "ISRO",
        altitude: 35786,
        impactTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        severity: "medium" as const
      }
    ];
    
    setImpactedSatellites(cmeActive ? mockImpactedSats : []);
  }, [cmeActive]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Disclaimer Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 p-3">
        <div className="flex items-center justify-center gap-2 text-sm text-destructive-foreground">
          <AlertTriangle className="w-4 h-4" />
          <span>This app is for educational purposes only. Refer to NOAA SWPC for official alerts.</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-solar-glow to-earth-glow bg-clip-text text-transparent">
              Space Weather Monitor
            </h1>
            <p className="text-muted-foreground text-sm">
              Solar flare and CME tracking system
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={cmeActive ? "destructive" : "secondary"} className="animate-pulse-glow">
              {cmeActive ? "CME ACTIVE" : "QUIET"}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {currentTime.toISOString().split('T')[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Impact Detection */}
        <div className="w-80 border-r border-border bg-card p-4">
          <ImpactDetectionTable 
            impactedSatellites={impactedSatellites}
            currentTime={currentTime}
          />
        </div>

        {/* 3D Visualization */}
        <div className="flex-1 relative">
          <SolarSystem3D 
            isPlaying={isPlaying} 
            currentTime={currentTime}
            onSatelliteClick={setSelectedSatellite}
            selectedSatelliteId={selectedSatellite?.id || null}
            onImpactedSatellitesChange={setImpactedSatellites}
          />
          
          {/* Timeline Controls Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
              <TimelineControls 
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                currentTime={currentTime}
                onTimeChange={setCurrentTime}
              />
            </Card>
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="w-80 border-l border-border bg-card">
          <ChatPanel impactedSatellites={impactedSatellites} />
        </div>
      </div>

      {/* Satellite Details Panel */}
      <SatelliteDetailsPanel 
        satellite={selectedSatellite}
        onClose={() => setSelectedSatellite(null)}
      />
    </div>
  );
};
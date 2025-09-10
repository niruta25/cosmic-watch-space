import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Satellite, Globe, Clock, User } from "lucide-react";

interface SatelliteInfo {
  id: string;
  name: string;
  operator: string;
  altitude: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  velocity: number;
  orbitType: string;
  launchDate: string;
  status: "operational" | "degraded" | "inactive";
}

interface SatelliteDetailsPanelProps {
  satellite: SatelliteInfo | null;
  onClose: () => void;
}

export const SatelliteDetailsPanel = ({ satellite, onClose }: SatelliteDetailsPanelProps) => {
  if (!satellite) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "secondary";
      case "degraded": return "default";
      case "inactive": return "destructive";
      default: return "secondary";
    }
  };

  const formatCoordinate = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="fixed right-4 top-20 bottom-20 w-80 z-50">
      <Card className="h-full p-4 bg-card/95 backdrop-blur-sm border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-satellite" />
            <h3 className="font-semibold">Satellite Details</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="font-medium text-lg mb-2">{satellite.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{satellite.operator}</span>
            </div>
            <Badge variant={getStatusColor(satellite.status)} className="text-xs">
              {satellite.status.toUpperCase()}
            </Badge>
          </div>

          {/* Orbital Parameters */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Orbital Parameters
            </h5>
            <div className="bg-secondary/20 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Altitude:</span>
                <span>{satellite.altitude} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Velocity:</span>
                <span>{satellite.velocity.toFixed(1)} km/s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Orbit Type:</span>
                <span>{satellite.orbitType}</span>
              </div>
            </div>
          </div>

          {/* Current Position */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Current Position (ECI)</h5>
            <div className="bg-secondary/20 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">X:</span>
                <span>{formatCoordinate(satellite.position.x)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Y:</span>
                <span>{formatCoordinate(satellite.position.y)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Z:</span>
                <span>{formatCoordinate(satellite.position.z)} km</span>
              </div>
            </div>
          </div>

          {/* Mission Info */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Mission Info
            </h5>
            <div className="bg-secondary/20 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Launch Date:</span>
                <span>{satellite.launchDate}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Satellite } from "lucide-react";

interface ImpactedSatellite {
  id: string;
  name: string;
  operator: string;
  altitude: number;
  impactTime: Date;
  severity: "high" | "medium" | "low";
}

interface ImpactDetectionTableProps {
  impactedSatellites: ImpactedSatellite[];
  currentTime: Date;
}

export const ImpactDetectionTable = ({ impactedSatellites, currentTime }: ImpactDetectionTableProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const formatTimeToImpact = (impactTime: Date) => {
    const diffMs = impactTime.getTime() - currentTime.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return "Impact occurred";
    if (diffHours < 1) return "< 1 hour";
    return `${diffHours}h`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-cme-warning" />
        <h3 className="font-semibold">CME Impact Detection</h3>
        <Badge variant="destructive" className="ml-auto">
          {impactedSatellites.length} Satellites at Risk
        </Badge>
      </div>

      {impactedSatellites.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Satellite className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No satellites currently in CME path</p>
        </div>
      ) : (
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {impactedSatellites.map((satellite) => (
              <div
                key={satellite.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{satellite.name}</h4>
                    <Badge variant={getSeverityColor(satellite.severity)} className="text-xs">
                      {satellite.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{satellite.operator}</p>
                  <p className="text-xs text-muted-foreground">Alt: {satellite.altitude}km</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-cme-warning">
                    {formatTimeToImpact(satellite.impactTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {satellite.impactTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
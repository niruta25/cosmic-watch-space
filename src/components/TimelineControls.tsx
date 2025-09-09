import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";

interface TimelineControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: Date;
  onTimeChange: (time: Date) => void;
}

export const TimelineControls = ({ 
  isPlaying, 
  onTogglePlay, 
  currentTime, 
  onTimeChange 
}: TimelineControlsProps) => {
  const formatTime = (date: Date) => {
    return date.toISOString().split('T')[1].split('.')[0];
  };

  const handleTimeSliderChange = (values: number[]) => {
    const newTime = new Date(values[0]);
    onTimeChange(newTime);
  };

  const resetTime = () => {
    onTimeChange(new Date());
  };

  const fastForward = () => {
    const newTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // +1 hour
    onTimeChange(newTime);
  };

  // Create timeline range (24 hours)
  const now = new Date();
  const startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000); // -12 hours
  const endTime = new Date(now.getTime() + 12 * 60 * 60 * 1000);   // +12 hours

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTogglePlay}
            className="bg-primary/10 border-primary/30 hover:bg-primary/20"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetTime}
            className="bg-secondary/10 border-secondary/30 hover:bg-secondary/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fastForward}
            className="bg-accent/10 border-accent/30 hover:bg-accent/20"
          >
            <FastForward className="w-4 h-4" />
          </Button>
        </div>

        <Badge variant="secondary" className="font-mono text-xs">
          {formatTime(currentTime)} UTC
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>T-12h</span>
          <span className="text-primary">Current Time</span>
          <span>T+12h</span>
        </div>
        
        <Slider
          value={[currentTime.getTime()]}
          onValueChange={handleTimeSliderChange}
          min={startTime.getTime()}
          max={endTime.getTime()}
          step={60000} // 1 minute steps
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-solar-glow font-semibold">CME Impact</div>
          <div className="text-muted-foreground">T+2.5h</div>
        </div>
        <div className="text-center">
          <div className="text-earth-glow font-semibold">Satellites</div>
          <div className="text-muted-foreground">8 tracked</div>
        </div>
        <div className="text-center">
          <div className="text-cme-warning font-semibold">Alert Level</div>
          <div className="text-muted-foreground">G2 Moderate</div>
        </div>
      </div>
    </div>
  );
};
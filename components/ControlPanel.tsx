import { Button } from "@/components/ui/button";
import { SWATCHES } from "@/constants";
import { RefreshCw, Calculator } from "lucide-react";
import { ColorSwatch } from "./ui/color-swatch";

interface ControlPanelProps {
  onReset: () => void;
  onCalculate: () => void;
  onColorChange: (color: string) => void;
}

export function ControlPanel({
  onReset,
  onCalculate,
  onColorChange,
}: ControlPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 rounded-lg shadow-md">
      <Button
        onClick={onReset}
        variant="outline"
        className="w-full"
        aria-label="Reset canvas"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Reset
      </Button>
      <Button
        onClick={onCalculate}
        variant="default"
        className="w-full"
        aria-label="Calculate"
      >
        <Calculator className="mr-2 h-4 w-4" />
        Calculate
      </Button>
      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        {SWATCHES.map((swatch) => (
          <ColorSwatch
            key={swatch}
            color={swatch}
            onClick={() => onColorChange(swatch)}
            aria-label={`Select color ${swatch}`}
          />
        ))}
      </div>
    </div>
  );
}

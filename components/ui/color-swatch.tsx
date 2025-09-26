import * as React from "react";
import { cn } from "@/lib/utils";

interface ColorSwatchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
}

const ColorSwatch = React.forwardRef<HTMLButtonElement, ColorSwatchProps>(
  ({ color, className, ...props }, ref) => {
    return (
      <button
        type="button"
        className={cn(
          "h-6 w-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
          className
        )}
        style={{ backgroundColor: color }}
        ref={ref}
        {...props}
      />
    );
  }
);
ColorSwatch.displayName = "ColorSwatch";

export { ColorSwatch };

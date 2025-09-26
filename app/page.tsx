/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { ColorSwatch, Group, Input } from "@mantine/core";
import { SWATCHES } from "@/constants";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Rnd } from "react-rnd";

interface GeneratedResult {
  expression: string;
  answer: string;
}

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

const NonStrictWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>{children}</div>;
};

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgb(255,255,255)");
  const [reset, setResetCanvas] = useState(false);
  const [result, setResult] = useState<GeneratedResult>();
  const [dictofvars, setDictofvars] = useState({});
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [lineWidth, setLineWidth] = useState(3);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<"brush" | "fill">("brush");

  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const startPos = (startY * canvas.width + startX) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];

    const fillColor = color.match(/\d+/g)?.map(Number) || [255, 255, 255];

    const colorMatch = (pos: number) => {
      const tolerance = 10;
      return (
        Math.abs(pixels[pos] - startR) <= tolerance &&
        Math.abs(pixels[pos + 1] - startG) <= tolerance &&
        Math.abs(pixels[pos + 2] - startB) <= tolerance &&
        Math.abs(pixels[pos + 3] - startA) <= tolerance
      );
    };

    const pixelsToCheck = [[startX, startY]];
    const visited = new Set();

    while (pixelsToCheck.length > 0) {
      const [x, y] = pixelsToCheck.pop()!;
      const pos = (y * canvas.width + x) * 4;
      const key = `${x},${y}`;

      if (
        x < 0 ||
        x >= canvas.width ||
        y < 0 ||
        y >= canvas.height ||
        visited.has(key) ||
        !colorMatch(pos)
      ) {
        continue;
      }

      visited.add(key);

      pixels[pos] = fillColor[0];
      pixels[pos + 1] = fillColor[1];
      pixels[pos + 2] = fillColor[2];
      pixels[pos + 3] = 255;

      pixelsToCheck.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const [generatedImagePosition, setGeneratedImagePosition] = useState({
    x: 10,
    y: 10,
  });
  const [generatedImageSize, setGeneratedImageSize] = useState({
    width: 200,
    height: 200,
  });

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setGeneratedImage(null);
      setDictofvars({});
      setResetCanvas(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = "round";
        ctx.lineWidth = lineWidth;
      }
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [lineWidth]);

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
    setLatexExpression([...latexExpression, latex]);

    // Clear the main canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== "brush") return;
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.style.background = "black";
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool !== "brush") return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const sendData = async () => {
    //console.log("Sending data");
    const canvas = canvasRef.current;
    if (canvas) {
      const response = await axios({
        method: "POST",
        url: "https://calculator-backend-qsmk.onrender.com/calculate",
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictofvars,
        },
      });

      const resp = await response.data;
      resp.data.forEach((data: Response) => {
        if (data.assign === true) {
          setDictofvars({
            ...dictofvars,
            [data.expr]: data.result,
          });
        }
      });
      const ctx = canvas.getContext("2d");
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setLatexPosition({ x: centerX, y: centerY });
      resp.data.forEach((data: Response) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 1000);
      });
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === "fill") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        floodFill(x,y);
      }
    }
  };

  const sendDataGenerated = async () => {
    //console.log("Sending data");
    const canvas = canvasRef.current;
    if (canvas) {
      const response = await axios({
        method: "POST",
        url: "https://calculator-backend-qsmk.onrender.com/generate",
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictofvars,
        },
      });

      const resp = await response.data;
      setGeneratedImage(resp.image);
      //console.log(resp.image);
    }
  };

  const buttonBaseStyle =
    "z-20 px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const primaryButtonStyle = `${buttonBaseStyle} bg-indigo-600 hover:bg-indigo-700 text-white`;
  const toolButtonStyle = (isActive: boolean) =>
    `${buttonBaseStyle} ${
      isActive
        ? "bg-indigo-700 text-white"
        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
    }`;

  return (
    <>
      <div className="fixed top-0 left-0 z-30 p-4">
        <div className="flex items-center">
          <img src="calculator.svg" />
          <span className="text-white ml-3 text-xl font-bold">MathCanvas</span>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="flex justify-center items-center space-x-4 mt-5">
          <Button
            onClick={() => setResetCanvas(true)}
            className={`${primaryButtonStyle} bg-red-600 hover:bg-red-700`}
            variant="default"
            color="black"
          >
            Reset
          </Button>
          <Button
            onClick={sendData}
            className={`${primaryButtonStyle} bg-green-600 hover:bg-red-700`}
            variant="default"
            color="black"
          >
            Calculate
          </Button>
          <Button
            onClick={sendDataGenerated}
            className={`${primaryButtonStyle} bg-green-600 hover:bg-red-700`}
            variant="default"
            color="black"
          >
            Generate
          </Button>
          <div className="z-20 flex flex-col items-center space-y-2">
            <Input
              id="lineWidth"
              type="number"
              min={1}
              max={50}
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="text-center w-16 rounded-lg"
            />
          </div>
          <Button
            onClick={() => setCurrentTool("brush")}
            className={`${primaryButtonStyle} bg-blue-600 hover:bg-red-700`}
            variant="default"
          >
            Brush
          </Button>
          <Button
            onClick={() => setCurrentTool("fill")}
            className={`${primaryButtonStyle} bg-blue-600 hover:bg-red-700`}
            variant="default"
          >
            Fill
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          <Group className="z-20">
            {SWATCHES.map((swatch) => (
              <ColorSwatch
                key={swatch}
                color={swatch}
                onClick={() => setColor(swatch)}
              />
            ))}
          </Group>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onClick={handleCanvasClick}
      />
      {latexExpression &&
        latexExpression.map((latex, index) => (
          <NonStrictWrapper key={index}>
            <Rnd
              defaultposition={latexPosition}
              onDragStop={(e: any, data: { x: any; y: any }) =>
                setLatexPosition({ x: data.x, y: data.y })
              }
            >
              <div className="absolute p-2 text-white rounded shadow-md">
                <div className="latex-content">{latex}</div>
              </div>
            </Rnd>
          </NonStrictWrapper>
        ))}

      {generatedImage && (
        <NonStrictWrapper>
          <Rnd
            default={{
              x: 10,
              y: 10,
              width: 200,
              height: 200,
            }}
            minWidth={100}
            minHeight={100}
            bounds="window"
            onDragStop={(e, d) => {
              setGeneratedImagePosition({ x: d.x, y: d.y });
            }}
            onResize={(e, direction, ref, delta, position) => {
              setGeneratedImageSize({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
              setGeneratedImagePosition(position);
            }}
          >
            <div className="bg-gray-800 p-2 rounded-lg">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-full object-contain rounded"
              />
            </div>
          </Rnd>
        </NonStrictWrapper>
      )}
    </>
  );
};

export default CanvasComponent;

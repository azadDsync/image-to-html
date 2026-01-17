"use client"

import { useState, useRef } from "react";

interface GridCell {
  row: number;
  col: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
}

export default function Home() {
  const [rows, setRows] = useState<number>(10);
  const [cols, setCols] = useState<number>(10);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const data = imageElement ? getGridColors({ image: imageElement, rows, cols }) : null;

  function getGridColors({
    image,
    rows,
    cols,
  }: {
    image: HTMLImageElement;
    rows: number;
    cols: number;
  }): GridCell[] {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];
    
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const cellW = Math.floor(canvas.width / cols);
    const cellH = Math.floor(canvas.height / rows);
    
    const result: GridCell[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const imageData = ctx.getImageData(
          c * cellW,
          r * cellH,
          cellW,
          cellH
        ).data;

        // average color
        let rSum = 0, gSum = 0, bSum = 0;
        const pixels = imageData.length / 4;

        for (let i = 0; i < imageData.length; i += 4) {
          rSum += imageData[i];
          gSum += imageData[i + 1];
          bSum += imageData[i + 2];
        }

        result.push({
          row: r,
          col: c,
          color: {
            r: Math.round(rSum / pixels),
            g: Math.round(gSum / pixels),
            b: Math.round(bSum / pixels)
          }
        });
      }
    }

    return result;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const img = new Image();
      img.onload = () => setImageElement(img);
      img.src = URL.createObjectURL(file);
    }
  };

  const handleDownload = () => {
    if (!data || data.length === 0) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = 20; // Size of each cell in pixels
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    data.forEach(({ color }) => {
      const x = (data.indexOf(data.find(cell => cell.color === color)!) % cols) * cellSize;
      const y = Math.floor(data.indexOf(data.find(cell => cell.color === color)!) / cols) * cellSize;
      
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(x, y, cellSize, cellSize);
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `grid-${rows}x${cols}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image to HTML Grid Pixel Converter",
    "description": "Convert any image into a colorful HTML pixel grid with customizable rows and columns",
    "url": "https://image-to-html-green.vercel.app",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Upload any image format",
      "Adjustable grid size (2-50 rows and columns)",
      "Real-time preview",
      "Download as PNG",
      "Dark mode support"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
     
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
           
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Image to Grid
              </h1>
            </div>

           
            <div className="flex items-center gap-4 flex-1 justify-end">
             
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md whitespace-nowrap"
              >
                {fileName ? `📁 ${fileName.slice(0, 15)}${fileName.length > 15 ? '...' : ''}` : "📤 Upload"}
              </label>

              
              <div className="flex items-center gap-2 min-w-[120px]">
                <label htmlFor="rows" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Rows: <span className="text-blue-600 dark:text-blue-400">{rows}</span>
                </label>
                <input
                  type="range"
                  id="rows"
                  min="2"
                  max="50"
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              
              <div className="flex items-center gap-2 min-w-[120px]">
                <label htmlFor="cols" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Cols: <span className="text-blue-600 dark:text-blue-400">{cols}</span>
                </label>
                <input
                  type="range"
                  id="cols"
                  min="2"
                  max="50"
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              
              <button
                onClick={handleDownload}
                disabled={!data || data.length === 0}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md disabled:cursor-not-allowed whitespace-nowrap disabled:opacity-50"
                aria-label="Download grid as PNG image"
              >
                💾 Download
              </button>

              
              {fileName && (
                <button
                  onClick={() => {
                    setImageElement(null);
                    setFileName("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                  aria-label="Clear uploaded image"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {data && data.length > 0 ? (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8" aria-label="Generated pixel grid">
            <div className="overflow-auto">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: '2px',
                  maxWidth: '100%',
                  aspectRatio: `${cols} / ${rows}`
                }}
                className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg"
                role="img"
                aria-label={`Pixel grid with ${rows} rows and ${cols} columns`}
              >
                {data.map(({ color }, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                      aspectRatio: '1',
                    }}
                    className="rounded-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer"
                    title={`RGB(${color.r}, ${color.g}, ${color.b})`}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-16 text-center" aria-label="Upload prompt">
            <div className="text-gray-400 dark:text-gray-500">
              <svg
                className="mx-auto h-24 w-24 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">No image selected</p>
              <p className="text-sm mt-1">Upload an image to get started</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

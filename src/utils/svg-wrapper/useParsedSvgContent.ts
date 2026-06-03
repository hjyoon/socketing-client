import { useEffect, useState } from "react";

interface ParsedSvgData {
  svgString: string;
}

export const useParsedSvgContent = (svgString: string) => {
  const [svgContent, setSvgContent] = useState({ content: "", viewBox: "" });

  useEffect(() => {
    if (!svgString) return;

    try {
      const parsedData = JSON.parse(svgString) as ParsedSvgData;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = parsedData.svgString;
      const svgElement = tempDiv.querySelector("svg");
      if (!svgElement) return;

      setSvgContent({
        content: Array.from(svgElement.children)
          .filter(
            (child) =>
              !(child instanceof Element) || !child.classList.contains("seats")
          )
          .map((child) => child.outerHTML)
          .join(""),
        viewBox: svgElement.getAttribute("viewBox") || "",
      });
    } catch (error) {
      console.error("Error parsing SVG string:", error);
    }
  }, [svgString]);

  return svgContent;
};

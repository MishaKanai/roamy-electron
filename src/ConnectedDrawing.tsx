import React from "react";
import Draw from "@excalidraw/excalidraw";
import { useDrawingPage } from "roamy/lib/Excalidraw/Page";
interface ConnectedDrawingProps {
  drawingName: string;
}
const ConnectedDrawing: React.FC<ConnectedDrawingProps> = ({ drawingName }) => {
  const [currDrawing, setDrawing] = useDrawingPage(drawingName);
  const initialData = React.useMemo(() => {
    return {
      elements: currDrawing.elements,
      appState: {
        viewBackgroundColor: "transparent",
      },
    };
  }, [currDrawing]);
  return (
    <Draw gridModeEnabled onChange={setDrawing} initialData={initialData} />
  );
};
export default ConnectedDrawing;

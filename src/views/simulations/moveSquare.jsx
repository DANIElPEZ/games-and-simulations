import { AppBar } from "./../../components/appBar";
import { useEffect, useRef, useState } from "react";

export function MoveSquarePage() {
     const canvasRef = useRef(null);
     const [angle, setAngle] = useState(0);
     const angleRef = useRef(0); // Guarda el ángulo actual para usar en el loop
   
     // Posición actual del centro del cuadrado (inicialmente en el centro del canvas)
     const squareCenterRef = useRef({ x: 150, y: 200 });
     // Objeto para llevar registro de las teclas presionadas
     const keysRef = useRef({});
   
     // Puntos base del cuadrado (definidos respecto a su centro)
     const basePoints = [
       { x: -20, y: -20 },
       { x: 20, y: -20 },
       { x: 20, y: 20 },
       { x: -20, y: 20 },
     ];
   
     useEffect(() => {
       const canvas = canvasRef.current;
       const ctx = canvas.getContext("2d");
       canvas.width = 310;
       canvas.height = 400;
       
       const speed_move = 3;
       // Inicializamos las coordenadas del mouse en el centro del cuadrado
       let mouseX = squareCenterRef.current.x;
       let mouseY = squareCenterRef.current.y;
   
       // Maneja el registro de teclas presionadas
       const handleKeyDown = (e) => {
         keysRef.current[e.key] = true;
       };
       const handleKeyUp = (e) => {
         keysRef.current[e.key] = false;
       };
   
       // Actualiza la posición del mouse en el canvas
       const handleMouseMove = (event) => {
         const rect = canvas.getBoundingClientRect();
         mouseX = event.clientX - rect.left;
         mouseY = event.clientY - rect.top;
       };
   
       window.addEventListener("keydown", handleKeyDown);
       window.addEventListener("keyup", handleKeyUp);
       canvas.addEventListener("mousemove", handleMouseMove);
   
       // Actualiza el ángulo basándose en la posición del mouse y el centro del cuadrado
       const updateAngle = () => {
         const { x, y } = squareCenterRef.current;
         const newAngle = Math.atan2(mouseY - y, mouseX - x);
         // Se actualiza solo si hay una diferencia apreciable
         if (Math.abs(newAngle - angleRef.current) > 0.001) {
           angleRef.current = newAngle;
           setAngle(newAngle);
         }
       };
   
       // Loop de dibujo
       const draw = () => {
         // Actualiza la posición del cuadrado según las teclas presionadas
         if (keysRef.current["w"]) {
           squareCenterRef.current.y -= speed_move;
         }
         if (keysRef.current["s"]) {
           squareCenterRef.current.y += speed_move;
         }
         if (keysRef.current["a"]) {
           squareCenterRef.current.x -= speed_move;
         }
         if (keysRef.current["d"]) {
           squareCenterRef.current.x += speed_move;
         }
   
         // Actualiza el ángulo basado en la nueva posición
         updateAngle();
   
         // Calcula el coseno y seno del ángulo actual
         const cosA = Math.cos(angleRef.current);
         const sinA = Math.sin(angleRef.current);
   
         // Calcula los puntos rotados del cuadrado
         const rotatedPoints = basePoints.map((point) => ({
           x: point.x * cosA - point.y * sinA + squareCenterRef.current.x,
           y: point.x * sinA + point.y * cosA + squareCenterRef.current.y,
         }));
   
         // Dibuja el cuadrado
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.beginPath();
         ctx.moveTo(rotatedPoints[0].x, rotatedPoints[0].y);
         for (let i = 1; i < rotatedPoints.length; i++) {
           ctx.lineTo(rotatedPoints[i].x, rotatedPoints[i].y);
         }
         ctx.closePath();
         ctx.strokeStyle = "#fff";
         ctx.stroke();
   
         requestAnimationFrame(draw);
       };
   
       draw();
   
       // Cleanup: remueve los event listeners al desmontar el componente
       return () => {
         window.removeEventListener("keydown", handleKeyDown);
         window.removeEventListener("keyup", handleKeyUp);
         canvas.removeEventListener("mousemove", handleMouseMove);
       };
     }, []);

  let content = (
    <div className="flex flex-col h-screen items-center justify-center bg-[var(--background)]" >
      <canvas
        ref={canvasRef}
        className="rounded-lg bg-[#777]"
      ></canvas>
      <p className="text-2xl text-[var(--text-color)]" style={{fontFamily:'Madimi One'}}>Ángulo: {(angle * (180 / Math.PI)).toFixed(0)}°</p>
      <span className="text-2xl text-[var(--text-color)]" style={{fontFamily:'Madimi One'}}>Teclas: WASD</span>
    </div>
  );

  return (
    <>
      <AppBar />
      {content}
    </>
  );
}

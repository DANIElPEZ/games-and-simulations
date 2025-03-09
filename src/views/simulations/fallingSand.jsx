import { useRef, useEffect } from "react";
import { AppBar } from "./../../components/appBar";

export function FallingSandPage() {
     const canvasRef = useRef(null);
     const animationRef = useRef(null);
   
     // Parámetros de la simulación
     const w = 3; // tamaño de cada “grano”
     const hueValueRef = useRef(200);
     const colsRef = useRef(0);
     const rowsRef = useRef(0);
     const gridRef = useRef(null);
   
     // Crea un array 2D con valores iniciales en 0
     const make2DArray = (cols, rows) => {
       const arr = new Array(cols);
       for (let i = 0; i < cols; i++) {
         arr[i] = new Array(rows).fill(0);
       }
       return arr;
     };
   
     // Verifica si las coordenadas están dentro del tablero
     const withinBoard = (col, row) => {
       return col >= 0 && col < colsRef.current && row >= 0 && row < rowsRef.current;
     };
   
     useEffect(() => {
       const canvas = canvasRef.current;
       canvas.width = 310;
       canvas.height = 640;
       const ctx = canvas.getContext('2d');
   
       // Inicializa el grid según el tamaño del canvas
       colsRef.current = Math.floor(canvas.width / w);
       rowsRef.current = Math.floor(canvas.height / w);
       gridRef.current = make2DArray(colsRef.current, rowsRef.current);
   
       // Variables para manejar el estado del mouse
       let mouseDown = false;
   
       // Función para agregar "sal" al arrastrar el mouse
       const addSalt = (e) => {
         const rect = canvas.getBoundingClientRect();
         const mouseX = e.clientX - rect.left;
         const mouseY = e.clientY - rect.top;
         const mouseCol = Math.floor(mouseX / w);
         const mouseRow = Math.floor(mouseY / w);
         const matrix = 10;
         const extend = Math.floor(matrix / 2);
   
         for (let i = -extend; i <= extend; i++) {
           for (let j = -extend; j <= extend; j++) {
             if (Math.random() < 0.75) {
               const col = mouseCol + i;
               const row = mouseRow + j;
               if (withinBoard(col, row)) {
                 gridRef.current[col][row] = hueValueRef.current;
               }
             }
           }
         }
         // Actualiza el valor del matiz (color)
         hueValueRef.current++;
         if (hueValueRef.current > 360) {
           hueValueRef.current = 0;
         }
       };
   
       // Event listeners para el mouse
       const handleMouseDown = (e) => {
         mouseDown = true;
         addSalt(e);
       };
   
       const handleMouseUp = () => {
         mouseDown = false;
       };
   
       const handleMouseMove = (e) => {
         if (mouseDown) {
           addSalt(e);
         }
       };
   
       canvas.addEventListener('mousedown', handleMouseDown);
       canvas.addEventListener('mouseup', handleMouseUp);
       canvas.addEventListener('mousemove', handleMouseMove);
       canvas.addEventListener('mouseleave', handleMouseUp);
   
       // Bucle de animación y simulación
       const animate = () => {
         // Dibuja el fondo y los granos de sal
         ctx.fillStyle = 'black';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         for (let i = 0; i < colsRef.current; i++) {
           for (let j = 0; j < rowsRef.current; j++) {
             if (gridRef.current[i][j] > 0) {
               // Se usa hsl para colorear los granos según el matiz
               ctx.fillStyle = `hsl(${gridRef.current[i][j]}, 100%, 50%)`;
               ctx.fillRect(i * w, j * w, w, w);
             }
           }
         }
   
         // Simulación de física para mover los granos
         const nextGrid = make2DArray(colsRef.current, rowsRef.current);
         for (let i = 0; i < colsRef.current; i++) {
           for (let j = 0; j < rowsRef.current; j++) {
             const state = gridRef.current[i][j];
             if (state > 0) {
               // Verifica la celda de abajo
               const below = (j + 1 < rowsRef.current) ? gridRef.current[i][j + 1] : -1;
               let dir = 1;
               if (Math.random() < 0.5) dir *= -1;
               let belowA = -1, belowB = -1;
               if (i + dir >= 0 && i + dir < colsRef.current && j + 1 < rowsRef.current) {
                 belowA = gridRef.current[i + dir][j + 1];
               }
               if (i - dir >= 0 && i - dir < colsRef.current && j + 1 < rowsRef.current) {
                 belowB = gridRef.current[i - dir][j + 1];
               }
               if (j + 1 < rowsRef.current && below === 0) {
                 nextGrid[i][j + 1] = state;
               } else if (i + dir >= 0 && i + dir < colsRef.current && j + 1 < rowsRef.current && belowA === 0) {
                 nextGrid[i + dir][j + 1] = state;
               } else if (i - dir >= 0 && i - dir < colsRef.current && j + 1 < rowsRef.current && belowB === 0) {
                 nextGrid[i - dir][j + 1] = state;
               } else {
                 nextGrid[i][j] = state;
               }
             }
           }
         }
         gridRef.current = nextGrid;
         animationRef.current = requestAnimationFrame(animate);
       };
   
       animate();
   
       // Limpieza al desmontar el componente
       return () => {
         cancelAnimationFrame(animationRef.current);
         canvas.removeEventListener('mousedown', handleMouseDown);
         canvas.removeEventListener('mouseup', handleMouseUp);
         canvas.removeEventListener('mousemove', handleMouseMove);
         canvas.removeEventListener('mouseleave', handleMouseUp);
       };
   
     }, []);

  return (
    <>
      <AppBar />
      <div className="flex flex-col bg-[var(--background)] h-screen justify-center items-center gap-2">
          <canvas ref={canvasRef}/>
          <span className="text-2xl text-[var(--text-color)]" style={{fontFamily:'Madimi One'}}>Usa el mouse</span>
      </div>
    </>
  );
}
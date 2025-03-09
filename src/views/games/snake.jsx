import { useState, useEffect, useRef, useCallback } from "react";
import { AppBar } from "./../../components/appBar";

export function SnakePage() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Estados del juego
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [speed] = useState(125);

  // Tamaño del grid
  const gridSize = 18;
  const tileCount = 19;

  // Generar comida aleatoria
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };

    // Verificar que la comida no aparezca en la serpiente
    for (let segment of snake) {
      if (segment.x === newFood.x && segment.y === newFood.y) {
        return generateFood();
      }
    }

    return newFood;
  }, [snake]);

  // Reiniciar juego
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: 0 });
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
  };

  // Detectar colisiones
  const checkCollision = (head) => {
    // Colisión con bordes
    if (
      head.x < 0 ||
      head.x >= tileCount ||
      head.y < 0 ||
      head.y >= tileCount
    ) {
      return true;
    }

    // Colisión con el cuerpo
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }

    return false;
  };

  // Movimiento y lógica del juego
  const gameLoop = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      // Actualizar posición de la cabeza
      head.x += direction.x;
      head.y += direction.y;

      // Verificar colisión
      if (checkCollision(head)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Comer comida
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev+0.5);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  // Dibujar en el canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Limpiar canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar serpiente
    ctx.fillStyle = "lime";
    snake.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
    });

    // Dibujar comida
    ctx.fillStyle = "red";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }, [snake, food]);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "w":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "s":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "a":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "d":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  const buttonPress = (e) => {
      switch (e) {
        case "w":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "s":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "a":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "d":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

  // Bucle principal del juego
  useEffect(() => {
    const interval = setInterval(() => {
      gameLoop();
      draw();
    }, speed);

    return () => clearInterval(interval);
  }, [gameLoop, draw, speed]);

  return (
    <>
      <AppBar />
      <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)]">
        <div className="relative flex flex-col items-center justify-center gap-1">
          <div className="text-[var(--text-color)] text-2xl" style={{fontFamily:'Madimi One'}}>
            Score: {score}
          </div>
          <canvas
            ref={canvasRef}
            width={gridSize * tileCount}
            height={gridSize * tileCount}
            style={{ border: "2px solid white" }}
          />
          {gameOver && (
            <div className="absolute flex flex-col items-center justify-center p-2 rounded-2xl bg-[var(--background-snake)]">
              <h2 className="text-[var(--text-color)]" style={{fontFamily:'Madimi One'}}>Game Over!</h2>
              <button onClick={resetGame} className="text-[var(--text-color)] cursor-pointer bg-[#356eab] rounded-sm py-0.5 px-1 hover:bg-[#356] duration-100" style={{fontFamily:'Madimi One'}}>Play Again</button>
            </div>
          )}
          <div className="flex relative">
            <button onClick={()=>buttonPress('a')} className="material-symbols-outlined p-2 bg-[var(--background-snake)] rounded-lg text-[var(--text-color)] cursor-pointer absolute -left-12 top-6">keyboard_arrow_left</button>
            <button onClick={()=>buttonPress('w')} className="material-symbols-outlined p-2 bg-[var(--background-snake)] rounded-lg text-[var(--text-color)] cursor-pointer absolute">keyboard_arrow_up</button>
            <button onClick={()=>buttonPress('d')} className="material-symbols-outlined p-2 bg-[var(--background-snake)] rounded-lg text-[var(--text-color)] cursor-pointer absolute left-12 top-6">keyboard_arrow_right</button>
            <button onClick={()=>buttonPress('s')} className="material-symbols-outlined p-2 bg-[var(--background-snake)] rounded-lg text-[var(--text-color)] cursor-pointer absolute top-12">keyboard_arrow_down</button>
          </div>
        </div>
      </div>
    </>
  );
}

import { AppBar } from "../../components/appBar";
import { useRef, useEffect, useState } from 'react';
import bricks from './../../assets/bricks.png';
import sprite from './../../assets/sprite.png';
import bkg from './../../assets/bkg.png';

export function BrickBreakerPage() {
  const canvasRef = useRef(null);
  const spriteRef = useRef(null);
  const bricksImageRef = useRef(null);
  // Ref para la posición X del jugador
  const playerXRef = useRef(null);

  // Refs para indicar si se está presionando una tecla o botón
  const leftKeyRef = useRef(false);
  const rightKeyRef = useRef(false);
  const leftButtonRef = useRef(false);
  const rightButtonRef = useRef(false);

  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Constantes globales
  const CANVAS_WIDTH = 317;
  const CANVAS_HEIGHT = 410;
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 10;
  const PLAYER_SPEED = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const sprite = spriteRef.current;
    const bricksImage = bricksImageRef.current;

    // Inicializamos la posición del jugador (si no está inicializada)
    if (playerXRef.current === null) {
      playerXRef.current = (CANVAS_WIDTH - PLAYER_WIDTH) / 2;
    }

    // Variables del juego
    let scorePoints = 0;
    const radius = 5;
    let xBall = canvas.width / 2;
    let yBall = canvas.height - 30;
    let xSpeed = 2;
    let ySpeed = -2;

    // Configuración de los ladrillos
    const brickRowCount = 9;
    const brickColumnCount = 11;
    const brickWidth = 26;
    const brickHeight = 13;
    const brickPadding = 1;
    const brickOffSetTop = 80;
    const brickOffSetLeft = 10.5;
    const bricksArr = [];
    const brickStatus = { built: 1, destroyed: 0 };

    for (let row = 0; row < brickRowCount; row++) {
      const rowBricks = [];
      for (let col = 0; col < brickColumnCount; col++) {
        const brickX = col * (brickPadding + brickWidth) + brickOffSetLeft;
        const brickY = row * (brickPadding + brickHeight) + brickOffSetTop;
        const color = Math.floor(Math.random() * 8);
        rowBricks.push({
          xPos: brickX,
          yPos: brickY,
          status: brickStatus.built,
          color: color
        });
      }
      bricksArr.push(rowBricks);
    }

    // Manejo de eventos de teclado
    const keyDownHandler = (e) => {
      const key = e.key;
      if (key.toLowerCase() === 'a' || key === 'ArrowLeft') {
        leftKeyRef.current = true;
      } else if (key.toLowerCase() === 'd' || key === 'ArrowRight') {
        rightKeyRef.current = true;
      }
    };

    const keyUpHandler = (e) => {
      const key = e.key;
      if (key.toLowerCase() === 'a' || key === 'ArrowLeft') {
        leftKeyRef.current = false;
      } else if (key.toLowerCase() === 'd' || key === 'ArrowRight') {
        rightKeyRef.current = false;
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Funciones de dibujo
    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(xBall, yBall, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();
    };

    const drawPlayer = () => {
      ctx.drawImage(
        sprite,
        29,
        174,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        playerXRef.current,
        canvas.height - PLAYER_HEIGHT - 10,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
    };

    const drawBricks = () => {
      for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
          const currentBrick = bricksArr[row][col];
          if (currentBrick.status === brickStatus.destroyed) continue;
          const clipX = 32 * currentBrick.color;
          ctx.drawImage(
            bricksImage,
            clipX,
            0,
            32,
            14,
            currentBrick.xPos,
            currentBrick.yPos,
            brickWidth,
            brickHeight
          );
        }
      }
    };

    const collisionDetection = () => {
      for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
          const currentBrick = bricksArr[row][col];
          if (currentBrick.status === brickStatus.destroyed) continue;
          const hitX = xBall > currentBrick.xPos && xBall < currentBrick.xPos + brickWidth;
          const hitY =
            yBall > currentBrick.yPos - radius &&
            yBall - radius < currentBrick.yPos + brickHeight;
          if (hitX && hitY) {
            ySpeed = -ySpeed;
            currentBrick.status = brickStatus.destroyed;
            scorePoints++;
            setScore(scorePoints);
          }
        }
      }
    };

    const ballMovement = () => {
      if (xBall > canvas.width - radius || xBall < radius) {
        xSpeed = -xSpeed;
      }
      if (yBall < radius) {
        ySpeed = -ySpeed;
      }
      const hitPlayerX =
        xBall > playerXRef.current && xBall < playerXRef.current + PLAYER_WIDTH;
      const hitPlayerY = yBall + radius > canvas.height - PLAYER_HEIGHT - 10;
      if (hitPlayerX && hitPlayerY) {
        ySpeed = -ySpeed;
      } else if (yBall > canvas.height - radius) {
        document.location.reload();
      }
      xBall += xSpeed;
      yBall += ySpeed;
    };

    const playerMovement = () => {
      // Se mueve si se presiona alguna tecla o botón
      if ((rightKeyRef.current || rightButtonRef.current) && playerXRef.current < canvas.width - PLAYER_WIDTH) {
        playerXRef.current += PLAYER_SPEED;
      }
      if ((leftKeyRef.current || leftButtonRef.current) && playerXRef.current > 0) {
        playerXRef.current -= PLAYER_SPEED;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPlayer();
      drawBricks();
      collisionDetection();
      ballMovement();
      playerMovement();
      requestAnimationFrame(draw);
    };

    if (gameStarted) {
      draw();
    }

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [gameStarted, CANVAS_WIDTH, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED]);

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <>
      <AppBar />
      <div className="bg-[var(--background)] relative flex flex-col h-dvh items-center justify-center">
        <span className="text-2xl text-[var(--text-color)]" style={{ fontFamily: "Madimi One" }}>
          Score: {score}
        </span>
        <canvas ref={canvasRef} style={{background:`url(${bkg})`}}></canvas>
        {!gameStarted && (
          <button
            style={{ fontFamily: "Madimi One" }}
            className="absolute p-2 bg-[#659ee0] text-xl text-[var(--text-color)] rounded-2xl cursor-pointer duration-300 hover:scale-115"
            onClick={handleStart}
          >
            Start Game
          </button>
        )}
        <div className="flex gap-2 mt-3">
          <button
            onMouseDown={() => { leftButtonRef.current = true; }}
            onMouseUp={() => { leftButtonRef.current = false; }}
            onTouchStart={() => { leftButtonRef.current = true; }}
            onTouchEnd={() => { leftButtonRef.current = false; }}
            className="material-symbols-outlined p-2 bg-[var(--background-brickbreaker)] rounded-lg text-[var(--text-color)] cursor-pointer"
          >
            keyboard_arrow_left
          </button>
          <button
            onMouseDown={() => { rightButtonRef.current = true; }}
            onMouseUp={() => { rightButtonRef.current = false; }}
            onTouchStart={() => { rightButtonRef.current = true; }}
            onTouchEnd={() => { rightButtonRef.current = false; }}
            className="material-symbols-outlined p-2 bg-[var(--background-brickbreaker)] rounded-lg text-[var(--text-color)] cursor-pointer"
          >
            keyboard_arrow_right
          </button>
        </div>
        <img hidden ref={bricksImageRef} src={bricks} alt="Bricks" />
        <img hidden ref={spriteRef} src={sprite} alt="Sprite" />
      </div>
    </>
  );
}

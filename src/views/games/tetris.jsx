import { AppBar } from "../../components/appBar";
import { useState, useEffect, useRef } from "react";
import musicFile from "./../../assets/Tetris.mp3";

const BLOCK_SIZE = 15;
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 30;

const PIECES = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
];

const PiecesColors = ["#48e", "#009600", "#720404", "#852fb1", "#f0a308"];

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export function TetrisPage() {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(0);
  const dropCounterRef = useRef(0);
  const musicRef = useRef(null);
  const gameOverRef = useRef(false);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setStartGame] = useState(true);

  // Usamos un ref para mantener el estado mutable del juego sin forzar re-render en cada frame
  const gameStateRef = useRef({
    board: createEmptyBoard(),
    piece: { position: { x: 6, y: 0 }, shape: PIECES[0] },
    pieceSelected: 0
  });

  // Comprueba si la pieza colisiona con el tablero o límites
  const checkCollision = () => {
    const { board, piece } = gameStateRef.current;
    const { position, shape } = piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = y + position.y;
          const boardX = x + position.x;
          // Fuera de límites o ya ocupado
          if (
            boardY < 0 ||
            boardY >= BOARD_HEIGHT ||
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            board[boardY][boardX] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Agrega la pieza actual al tablero y genera una nueva
  const addPieceToBoard = () => {
    if (gameOverRef.current) return;

    const { board, piece } = gameStateRef.current;
    const { position, shape } = piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          board[y + position.y][x + position.x] = 1;
        }
      }
    }
    setScore((prev) => prev + 1);
    // Selecciona nueva pieza al azar
    const nextPieceIndex = Math.floor(Math.random() * PIECES.length);
    gameStateRef.current.pieceSelected = nextPieceIndex;
    gameStateRef.current.piece.shape = PIECES[nextPieceIndex];
    gameStateRef.current.piece.position = { x: 6, y: 0 };
    // Si al colocar la nueva pieza hay colisión, termina el juego
    if (checkCollision()) {
      setGameOver(true);
      gameOverRef.current = true;
      cancelAnimationFrame(requestRef.current);
    }
  };

  // Elimina filas completas
  const removeRow = () => {
    const { board } = gameStateRef.current;
    for (let y = 0; y < board.length; y++) {
      if (board[y].every((cell) => cell !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(BOARD_WIDTH).fill(0));
      }
    }
  };

  // Rota la pieza (si hay colisión, se revierte)
  const rotatePiece = () => {
    const { piece } = gameStateRef.current;
    const { shape } = piece;
    const newShape = [];
    for (let x = 0; x < shape[0].length; x++) {
      const newRow = [];
      for (let y = shape.length - 1; y >= 0; y--) {
        newRow.push(shape[y][x]);
      }
      newShape.push(newRow);
    }
    const oldShape = piece.shape;
    piece.shape = newShape;
    if (checkCollision()) {
      piece.shape = oldShape;
    }
  };

  // Función principal de actualización (bucle de juego)
  const update = (time = 0) => {
    if(gameOverRef.current){
     cancelAnimationFrame(requestRef.current);
     return;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;
    if (dropCounterRef.current > 300) {
      gameStateRef.current.piece.position.y++;
      if (checkCollision()) {
          gameStateRef.current.piece.position.y--; // revierte movimiento
          addPieceToBoard();
          removeRow();
      }
      dropCounterRef.current = 0;
    }
    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  // Dibuja el tablero y la pieza en el canvas
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibuja el tablero
    const board = gameStateRef.current.board;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] !== 0) {
          ctx.fillStyle = "#8f0";
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    // Dibuja la pieza actual
    const { piece, pieceSelected } = gameStateRef.current;
    const { position, shape } = piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          ctx.fillStyle = PiecesColors[pieceSelected % PiecesColors.length];
          ctx.fillRect(x + position.x, y + position.y, 1, 1);
        }
      }
    }
  };

  // Manejo de eventos de teclado para mover y rotar la pieza
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOverRef.current) return;
      const piece = gameStateRef.current.piece;
      if (e.key === "d") {
        piece.position.x++;
        if (checkCollision()) {
          piece.position.x--;
        }
      }
      if (e.key === "a") {
        piece.position.x--;
        if (checkCollision()) {
          piece.position.x++;
        }
      }
      if (e.key === "s") {
        piece.position.y++;
        if (checkCollision()) {
          piece.position.y--;
          addPieceToBoard();
          removeRow();
        }
      }
      if (e.key === "w") {
        rotatePiece();
      }
      draw();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  const buttonPress = (e) => {
     if (gameOverRef.current) return;
     const piece = gameStateRef.current.piece;
     if (e === "d") {
       piece.position.x++;
       if (checkCollision()) {
         piece.position.x--;
       }
     }
     if (e === "a") {
       piece.position.x--;
       if (checkCollision()) {
         piece.position.x++;
       }
     }
     if (e === "s") {
       piece.position.y++;
       if (checkCollision()) {
         piece.position.y--;
         addPieceToBoard();
         removeRow();
       }
     }
     if (e === "w") {
       rotatePiece();
     }
     draw();
   };

  // Inicia o reinicia el juego
  const startGame = () => {
     cancelAnimationFrame(requestRef.current);
     gameOverRef.current=false;
    gameStateRef.current.board = createEmptyBoard();
    gameStateRef.current.piece = { position: { x: 6, y: 0 }, shape: PIECES[0] };
    gameStateRef.current.pieceSelected = 0;
    setScore(0);
    setStartGame(false);
    setGameOver(false);
    lastTimeRef.current = 0;
    dropCounterRef.current = 0;
    if (musicRef.current) {
      musicRef.current.play();
    }
    requestRef.current = requestAnimationFrame(update);
  };

  // Configuración inicial del canvas y la música
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = BOARD_WIDTH * BLOCK_SIZE;
    canvas.height = BOARD_HEIGHT * BLOCK_SIZE;
    const ctx = canvas.getContext("2d");
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

    musicRef.current = new Audio(musicFile);
    musicRef.current.loop = true;
  }, []);

  let content = (
    <div className="bg-[var(--background)] flex flex-col h-dvh items-center justify-center">
      <div className="flex flex-col items-center justify-center relative">
        <span
          className="text-2xl text-[var(--text-color)]"
          style={{ fontFamily: "Madimi One" }}
        >
          Score: {score}
        </span>
        <canvas ref={canvasRef} className="bg-amber-800"></canvas>
        <button
          onClick={startGame}
          className="bg-[#017b80] cursor-pointer duration-300 hover:scale-115 absolute text-[var(--text-color)] p-2 rounded-lg"
          style={{ fontFamily: "Madimi One", opacity: gameOver || gameStart? 1 : 0 }}
        >
          {gameOver ? "Restart Game" : "Start Game"}
        </button>
      </div>
      <div className="flex relative mt-3">
            <button onClick={()=>buttonPress('a')} className="material-symbols-outlined p-2 bg-[var(--background-tetris)] rounded-lg text-[var(--text-color)] cursor-pointer absolute -left-12 top-6">keyboard_arrow_left</button>
            <button onClick={()=>buttonPress('w')} className="material-symbols-outlined p-2 bg-[var(--background-tetris)] rounded-lg text-[var(--text-color)] cursor-pointer absolute">refresh</button>
            <button onClick={()=>buttonPress('d')} className="material-symbols-outlined p-2 bg-[var(--background-tetris)] rounded-lg text-[var(--text-color)] cursor-pointer absolute left-12 top-6">keyboard_arrow_right</button>
            <button onClick={()=>buttonPress('s')} className="material-symbols-outlined p-2 bg-[var(--background-tetris)] rounded-lg text-[var(--text-color)] cursor-pointer absolute top-12">keyboard_arrow_down</button>
          </div>
    </div>
  );

  return (
    <>
      <AppBar />
      {content}
    </>
  );
}

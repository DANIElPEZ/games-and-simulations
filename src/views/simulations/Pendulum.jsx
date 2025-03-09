import { AppBar } from "./../../components/appBar";
import { useEffect, useRef } from "react";

export function PendulumPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 310;
    canvas.height = 300;

    let centerY = 150;
    let centerX = 130;
    let radius = 135;
    let gravity = 0.398;
    let speed_rotate = 0;
    let aceleration = 0;
    let angle = (Math.PI / 180) * 150;

    function update() {
      ctx.clearRect(0, 0, 310, 300);

      aceleration = ((-1 * gravity) / radius) * Math.sin(angle);
      speed_rotate += aceleration;
      angle += speed_rotate;

      let x = centerX + radius * Math.cos(angle);
      let y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#0f0";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#f00";
      ctx.fill();

      requestAnimationFrame(update);
    }

    update();
  }, []);

  let content = (
    <div className="flex flex-col justify-center gap-2 items-center h-screen bg-[var(--background)]">
      <canvas ref={canvasRef} className="bg-[#186370] rotate-90"></canvas>
      <div className="w-75">
        <h5 className="text-neutral-900 text-2xl text-center">
          El Hipnótico Movimiento del Péndulo
        </h5>
        <p className="text-neutral-700 text-center">
          Desde los tiempos de Galileo, el péndulo ha fascinado a científicos y
          curiosos por igual. Su movimiento oscilatorio es un testimonio de las
          fuerzas naturales en acción, mostrando la relación entre la gravedad y
          la inercia. Observa cómo este péndulo simulado se balancea en perfecta
          armonía con las leyes de la física.
        </p>
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

import { Route, Routes, BrowserRouter } from "react-router"
// Main views
import { MainPage } from './views/mainPage'
import { GamePage } from './views/gamePage'
import { SimulationsPage } from './views/simulationPage'
// Games views
import { BrickBreakerPage } from "./views/games/brickBreaker"
import { MinesWeeperPage } from "./views/games/minesWeeper"
import { PongPage } from "./views/games/pong"
import { SnakePage } from "./views/games/snake"
import { TetrisPage } from "./views/games/tetris"
// Simulations views
import { PendulumPage } from './views/simulations/Pendulum'
import { MoveSquarePage } from './views/simulations/moveSquare'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<MainPage/>}/>
          <Route path="/games" element={<GamePage/>}/>
          <Route path="/games/brickBreaker" element={<BrickBreakerPage/>}/>
          <Route path="/games/minesWeeper" element={<MinesWeeperPage/>}/>
          <Route path="/games/pong" element={<PongPage/>}/>
          <Route path="/games/snake" element={<SnakePage/>}/>
          <Route path="/games/tetris" element={<TetrisPage/>}/>
          <Route path="/simulations" element={<SimulationsPage/>}/>
          <Route path="/simulations/pendulum" element={<PendulumPage/>}/>
          <Route path="/simulations/moveSquare" element={<MoveSquarePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
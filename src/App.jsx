import { Route, Routes, BrowserRouter } from "react-router-dom"
import './styles/App.css'
// Main views
import { MainPage } from './views/mainPage'
import { GamePage } from './views/gamePage'
import { SimulationsPage } from './views/simulationPage'
// Games views
import { BrickBreakerPage } from "./views/games/brickBreaker"
import { SnakePage } from "./views/games/snake"
import { TetrisPage } from "./views/games/tetris"
// Simulations views
import { FallingSandPage } from "./views/simulations/fallingSand"
import { MoveSquarePage } from './views/simulations/moveSquare'
import { PendulumPage } from './views/simulations/Pendulum'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<MainPage/>}/>
          <Route path="/games" element={<GamePage/>}/>
          <Route path="/games/brickBreaker" element={<BrickBreakerPage/>}/>
          <Route path="/games/snake" element={<SnakePage/>}/>
          <Route path="/games/tetris" element={<TetrisPage/>}/>
          <Route path="/simulations" element={<SimulationsPage/>}/>
          <Route path="/simulations/fallingSand" element={<FallingSandPage/>}/>
          <Route path="/simulations/moveSquare" element={<MoveSquarePage/>}/>
          <Route path="/simulations/pendulum" element={<PendulumPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
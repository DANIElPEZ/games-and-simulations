import { AppBar } from "../components/appBar"
import { Button } from "../components/button"
// images
import brickBreaker from './../assets/brickBreaker.png'
import snake from './../assets/snake.png'
import tetris from './../assets/tetris.png'

export function GamePage(){
     let content=(
          <div className="bg-[var(--background)] flex flex-col items-center justify-center gap-10 pb-10">
               <Button
               text={'Brick Breaker'}
               image={brickBreaker}
               color={'--background-brickbreaker'}
               link={'/games/brickBreaker'}
               />
               
               <Button
               text={'tetris'}
               image={tetris}
               color={'--background-tetris'}
               link={'/games/tetris'}
               />
               <Button
               text={'Snake'}
               image={snake}
               color={'--background-snake'}
               link={'/games/snake'}
               />
          </div>
     )
     
     return(
          <>
               <AppBar/>
               {content}
          </>
     )
}
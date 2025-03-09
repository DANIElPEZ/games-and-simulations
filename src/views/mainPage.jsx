import { AppBar } from "./../components/appBar"
import { Button } from '../components/button'
// images
import game from './../assets/game.png'
import simulation from './../assets/simulation.png'

export function MainPage(){
     let content=(<div className="bg-[var(--background)] flex flex-col xl:flex-row xl:h-screen items-center justify-center gap-10 pb-10">
          <Button
               text="Games"
               image={game}
               color="--background-games"
               link="/games"
          />
          <Button
               text='Simulations'
               image={simulation}
               color={'--background-simulations'}
               link='/simulations'
          />
     </div>)

     return(
          <>
               <AppBar/>
               {content}
          </>
     )
}
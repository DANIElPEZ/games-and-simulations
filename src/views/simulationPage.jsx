import { AppBar } from "../components/appBar"
import { Button } from "../components/button"
// images
import fallingSand from './../assets/fallingSand.png'
import moveSquare from './../assets/moveSquare.png'
import pendulum from './../assets/pendulum.png'

export function SimulationsPage(){
     let content=(
          <div className="bg-[var(--background)] flex flex-col items-center justify-center gap-10 pb-10">
                         <Button
                         text={'Falling Sand'}
                         image={fallingSand}
                         color={'--background-falling-sand'}
                         link={'/simulations/fallingSand'}
                         />
                         
                         <Button
                         text={'Move Square'}
                         image={moveSquare}
                         color={'--background-move-square'}
                         link={'/simulations/moveSquare'}
                         />
                         <Button
                         text={'Pendulum Motion'}
                         image={pendulum}
                         color={'--background-pendulum'}
                         link={'/simulations/pendulum'}
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
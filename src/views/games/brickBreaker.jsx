import { AppBar } from "../../components/appBar"
import { useRef, useEffect, useState } from 'react';
import bricks from './../../assets/bricks.png'
import sprite from './../../assets/sprite.png'

export function BrickBreakerPage(){
     let content=(
          <div className="bg-[var(--background)] flex flex-col h-dvh items-center justify-center">
               <img hidden src={bricks} />
               <img hidden src={sprite} />
          </div>
     )

     return(
          <>
               <AppBar/>
               {content}
          </>
     )
}
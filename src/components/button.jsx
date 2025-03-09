import { Link } from "react-router";

export function Button({text, image, color, link}) {
  return (
     <Link to={link}>
          <button style={{backgroundColor:`var(${color})`, fontFamily:'Quicksand'}}
          className="flex flex-col w-80 sm:w-140 shadow-2xl hover:opacity-98 cursor-pointer text-2xl font-bold p-7 rounded-lg gap-3 transition duration-300 ease-in-out transform hover:scale-101 hover:-translate-y-2">
               <h4 className="text-[var(--text-color)] tracking-wide text-2xl">
                    {text}
               </h4>
               <img src={image} alt={image} className="rounded-2xl h-80 object-cover" />
          </button>
     </Link>
  )
}

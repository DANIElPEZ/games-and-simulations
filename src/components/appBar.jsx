import { Link } from "react-router-dom";

export function AppBar() {
  return (
    <>
      <div className="flex w-full h-15 items-center px-4 bg-[var(--background-app-bar)] top-0 left-0 z-10 sticky">
        <div className="flex items-center">
          <Link className="flex items-center" to="/">
          <div className="flex items-center relative mr-14">
            <span className="material-symbols-outlined absolute text-[var(--text-color)] scale-160">experiment</span>
            <span className="material-symbols-outlined absolute text-[var(--text-color)] scale-145 left-5">stadia_controller</span>
          </div>
            <h2 className="text-[var(--text-color)] text-2xl" style={{fontFamily:'Madimi One'}}>Games  and simulations</h2>
          </Link>
        </div>
      </div>
      <div className="bg-[var(--background)] pt-10"></div>
    </>
  );
}

import { useState } from "react";
import "./App.css";
import Sketch from "./Sketch";

export const squares: Square[] = [];

export interface Info {
  open: boolean;
  id: number;
}

export interface Square {
  id: number;
  scale_x: number;
  scale_y: number;
  vel: number;
  pos_x: number;
  pos_y: number;
  colour: number;
}

function App() {
  const [squares, setSquares] = useState<Record<number, Square>>({});
  const [info, setOpen] = useState<Info>({ open: false, id: -1 });
  const updateSquares = (newSquares: Record<number, Square>) => {
    setSquares(newSquares);
  };

  return (
    <div className="root">
      <h1>Main App</h1>
      <Sketch updateSquares={updateSquares} setOpen={setOpen} />
      {/* Render information about squares here if needed */}
      {info.open ? (
        <div className="info">
          {squares[info.id]?.id}
          <p>{squares[info.id]?.pos_x}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

// function App() {
//   //const [squares, setSquares] = useLocalStorage<Square[]>("squares", []);

//   const [open, setOpen] = useState<Info>({
//     data: {
//       colour: 0,
//       id: -1,
//       pos_x: -1,
//       pos_y: -1,
//       scale_x: -1,
//       scale_y: -1,
//       vel: -1,
//     },
//     name: "",
//     open: false,
//     id: -1,
//   });

//   const [shouldUpate, setShouldUpdate] = useState(false);

//   return (
//     <>
//       <div className="nav">
//         <h2>The Navbar</h2>
//       </div>
//       <div className={"root"}>
//         <h1>Header</h1>
//         <Sketch func={setOpen} setShouldUpdate={setShouldUpdate} />
//       </div>

//       {open.open ? (
//         <div className="info">
//           <p>{`${squares.find((square) => square.id === open.id)?.pos_x}`}</p>
//         </div>
//       ) : (
//         <></>
//       )}
//     </>
//   );
// }

export default App;

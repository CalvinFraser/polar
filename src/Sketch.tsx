/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useRef, useState } from "react";
// import p5 from "p5";
// import { Info, Square } from "./App";

// interface SketchProps {
//   func: (text: Info) => void; // Assuming setHeader is a function that takes a string argument
//   squares: Record<number, Square>;
//   addSquare: (square: Square) => void;
// }

// const Sketch = (props: SketchProps) => {
//   const { func, squares, addSquare } = props;
//   const renderRef = useRef<HTMLDivElement>(null);
//   const sketchRef = useRef<p5 | null>(null);
//   const squaresRef = useRef(squares);
//   squaresRef.current = squares;
//   const [state, stateSet] = useState(false);
//   const width = 1024;
//   const height = 720;
//   let id = 0;

//   useEffect(() => {
//     squaresRef.current = squares;
//   }, [squares]);

//   useEffect(() => {
//     const currentSquares = squaresRef.current;
//     if (renderRef.current && !sketchRef.current) {
//       sketchRef.current = new p5((p: p5) => {
//         p.setup = () => {
//           p.createCanvas(width, height).parent(renderRef.current!);
//         };
//         p.draw = () => {
//           // Your drawing logic goes here
//           p.background(0);

//           for (const s of Object.values(squares)) {
//             p.colorMode("rgb").fill(255, 255, s.colour);
//             p.fill(255, 255, s.colour);
//             p.rect(s.pos_x, s.pos_y, s.scale_x, s.scale_y);
//             //s.pos_x += 0.1 * p.deltaTime;

//             if (s.pos_x >= width) {
//               s.pos_x = -55;
//             }
//           }

//           p.frameRate(30);
//           // setSquares({ ...squares });
//         };

//         p.mouseClicked = () => {
//           if (
//             p.mouseX >= width - 50 ||
//             p.mouseX <= 0 ||
//             p.mouseY >= height - 50 ||
//             p.mouseY <= 0
//           ) {
//             return;
//           }

//           let push = true;
//           for (const s of Object.values(squares)) {
//             if (p.mouseX >= s.pos_x && p.mouseX <= s.pos_x + s.scale_x) {
//               if (p.mouseY >= s.pos_y && p.mouseY <= s.pos_y + s.scale_y) {
//                 push = false;
//                 func({
//                   open: true,
//                   name: `${s.id}`,
//                   data: s,
//                   id: s.id,
//                 });
//               }
//             }
//           }

//           if (push) {
//             const s = {
//               id: id++,
//               pos_x: p.mouseX as number,
//               pos_y: p.mouseY as number,
//               scale_x: 50,
//               scale_y: 50,
//               vel: 5,
//               colour: Math.floor(Math.random() * 255),
//             };

//             addSquare(s);
//             stateSet(false);
//             func({
//               data: {
//                 colour: 0,
//                 id: -1,
//                 pos_x: -1,
//                 pos_y: -1,
//                 scale_x: -1,
//                 scale_y: -1,
//                 vel: -1,
//               },
//               name: "",
//               open: false,
//               id: -1,
//             });
//             console.log(id);
//           }
//         };
//       });
//     }

//     return () => {
//       // Cleanup function to remove the p5 instance when the component unmounts
//       if (sketchRef.current) {
//         sketchRef.current.remove();
//         sketchRef.current = null;
//       }
//     };
//   }, []);

//   return <div className="sketch_container" ref={renderRef}></div>;
// };

// export default Sketch;

// Sketch.tsx
import p5 from "p5";
import React, { useLayoutEffect, useRef } from "react";
import { Square } from "./App";

interface SketchProps {
  updateSquares: (squares: Record<number, Square>) => void;
  setOpen: (info: { id: number; open: boolean }) => void;
}

interface Line {
  pos_1_x: number;
  pos_1_y: number;
  pos_2_x: number;
  pos_2_y: number;
}

const Sketch: React.FC<SketchProps> = ({ updateSquares, setOpen }) => {
  const renderRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  let firstSquare: Square | null = null;
  let secondSquare: Square | null = null;

  let firstPoint: { x: number; y: number } | null = null;
  let secondPoint: { x: number; y: number } | null = null;

  const lines: Line[] = [];
  let processing = false;

  useLayoutEffect(() => {
    const squares: Record<number, Square> = {};

    squares[0] = {
      colour: 255,
      id: 0,
      pos_x: 50,
      pos_y: 50,
      scale_x: 50,
      scale_y: 50,
      vel: 0,
    };
    squares[1] = {
      colour: 255,
      id: 1,
      pos_x: 450,
      pos_y: 50,
      scale_x: 50,
      scale_y: 50,
      vel: 0,
    };

    // let squareCount = 0;
    const sketch = new p5((p: p5) => {
      const direction = p
        .createVector(
          squares[1].pos_x - squares[0].pos_x,
          squares[1].pos_y - squares[0].pos_y
        )
        .normalize();

      const circlePos = p.createVector(
        squares[0].pos_x + 75,
        squares[0].pos_y + 25
      );

      p.setup = () => {
        p.createCanvas(800, 600).parent(renderRef.current!);
      };

      p.draw = () => {
        p.background(0);

        p.frameRate(30);

        for (const line of lines) {
          p.stroke(120);
          p.strokeWeight(6);
          p.line(line.pos_1_x, line.pos_1_y, line.pos_2_x, line.pos_2_y);
        }
        p.stroke(120);
        p.strokeWeight(6);
        p.line(
          squares[0].pos_x + 25,
          squares[0].pos_y + 25,
          squares[1].pos_x + 25,
          squares[1].pos_y + 25
        );
        for (const s of Object.values(squares)) {
          p.strokeWeight(1);
          p.fill(255, 255, s.colour);
          p.rect(s.pos_x, s.pos_y, s.scale_x, s.scale_y);
          // s.pos_x += 0.1 * p.deltaTime;
          if (s.pos_x >= p.width) {
            s.pos_x = -55;
          }
        }
        const color = p.color(255, 255, 255, 50);
        p.colorMode("rgb");
        p.fill(color);
        p.rect(p.mouseX - 25, p.mouseY - 25, 50, 50);

        if (p.keyIsDown(p.CONTROL) && p.keyIsDown(90) && !processing) {
          const ids = Object.values(squares).map((square) => square.id);
          const toRemove = ids.pop();
          console.log(toRemove);
          if (toRemove) {
            delete squares[toRemove];
          }
          processing = true;
        }
        if (!p.keyIsDown(90) && processing) {
          processing = false;
        }

        p.fill(255, 0, 0);
        p.ellipse(circlePos.x, circlePos.y, 30, 30);

        circlePos.x += direction.x * 2;
        circlePos.y += direction.y * 2;

        if (
          p.dist(
            circlePos.x,
            circlePos.y,
            squares[1].pos_x,
            squares[1].pos_y + 25
          ) < 25
        ) {
          direction.x *= -1;
          direction.y *= -1;
          console.log(direction.x);
        }

        if (
          p.dist(
            circlePos.x,
            circlePos.y,
            squares[0].pos_x + 50,
            squares[0].pos_y + 25
          ) < 2
        ) {
          direction.x *= -1;
          direction.y *= -1;
          console.log(direction.x);
        }

        updateSquares({ ...squares });
      };

      p.mouseClicked = () => {
        if (
          p.mouseX >= p.width - 50 ||
          p.mouseX <= 0 ||
          p.mouseY >= p.height - 50 ||
          p.mouseY <= 0
        ) {
          return;
        }

        let push = true;
        for (const s of Object.values(squares)) {
          if (p.mouseX >= s.pos_x && p.mouseX <= s.pos_x + s.scale_x) {
            if (p.mouseY >= s.pos_y && p.mouseY <= s.pos_y + s.scale_y) {
              push = false;
              setOpen({ id: s.id, open: true });

              if (!firstSquare) {
                firstSquare = s;
                firstPoint = { x: p.mouseX, y: p.mouseY };
              } else if (firstSquare && !secondSquare) {
                secondPoint = { x: p.mouseX, y: p.mouseY };
                secondSquare = s;
                const line: Line = {
                  pos_1_x: firstSquare.pos_x + 25,
                  pos_1_y: firstSquare.pos_y + 25,
                  pos_2_x: secondSquare.pos_x + 25,
                  pos_2_y: secondSquare.pos_y + 25,
                };
                lines.push(line);
                firstSquare = null;
                secondSquare = null;
              }
            }
          }
        }

        if (push) {
          const newSquare: Square = {
            id: Date.now(),
            pos_x: (p.mouseX - 25) as number,
            pos_y: (p.mouseY - 25) as number,
            scale_x: 50,
            scale_y: 50,
            vel: 5,
            colour: Math.floor(Math.random() * 255),
          };
          squares[newSquare.id] = newSquare;
          setOpen({ id: -1, open: false });
          firstSquare = null;
          secondSquare = null;
          firstPoint = null;
          secondPoint = null;
        }
      };
    });

    if (sketchRef.current) {
      sketchRef.current.remove();
      sketchRef.current = null;
    }

    sketchRef.current = sketch;

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
        sketchRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={renderRef}></div>;
};

export default Sketch;

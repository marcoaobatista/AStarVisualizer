import {Graph} from "./Graph.jsx";
import {useState} from "react";
import { LuEraser } from "react-icons/lu";

const options = ["start", "end", "wall", "eraser"];
const optionToChar = {
    "start": '&',
    "end": "#",
    "wall": '@',
    "eraser": ' ',
}

const pathChar = '$';
const visitedChar = ';';

const charToOption = Object.fromEntries(
    Object.entries(optionToChar).map(([key, value]) => [value, key])
);

const optionToColor = {
    "start": "text-blue-500",
    "end": "text-red-500",
    "wall": "text-white",
    "eraser": "text-white",
}

const ShortestPathApp = ({cols, rows}) => {
    const [graph, setGraph] = useState(() => new Graph(cols, rows));
    const [pencil, setPencil] = useState('');
    const [version, setVersion] = useState(0);

    const [startVertex, setStartVertex] = useState(null);
    const [endVertex, setEndVertex] = useState(null);

    const [mouseDown, setMouseDown] = useState(false);

    const handleRadioChange = (event) => {
        setPencil(event.target.value);
    };

    const runAStar = async () => {
        graph.clear();
        let reconstructedPath = graph.aStar(startVertex, endVertex);

        for (let i = 0; i < reconstructedPath.length; i++) {
            let vertex = graph.vertices.get(reconstructedPath[i])
            if (charToOption[vertex.getChar()] === "start" || charToOption[vertex.getChar()] === "end") continue;
            vertex.setChar(pathChar);
            setVersion(version + 1);
        }
    }

    const reset = () => {
        setGraph(new Graph(cols, rows));
        setVersion(0);
        setStartVertex(null);
        setEndVertex(null);
    }

    // Create dynamic regex patterns using template literals
    const topLeftCorner = new RegExp(`^0,0$`);
    const topRightCorner = new RegExp(`^${cols - 1},0$`);
    const bottomLeftCorner = new RegExp(`^0,${rows - 1}$`);
    const bottomRightCorner = new RegExp(`^${cols - 1},${rows - 1}$`);
    const leftEdge = new RegExp(`^0,.*$`);
    const rightEdge = new RegExp(`^${cols - 1},.*$`);
    const topEdge = new RegExp(`^.*,0$`);
    const bottomEdge = new RegExp(`^.*,${rows - 1}$`);
    
    return (
        <div>
            <div
                onMouseDown={() => {setMouseDown(true)}}
                onMouseUp={() => {setMouseDown(false)}}
                onMouseLeave={() => {setMouseDown(false)}}
                style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`
            }}>
                {Array.from(graph.getVertices().values()).map((vertex) => (
                    <div
                        onMouseDown={()=>{
                        if (vertex.getIsFrame()) {
                            return;
                        }
                         if (pencil === "start" && startVertex == null) {
                                vertex.setChar(optionToChar["start"]);
                                setStartVertex(vertex.id);
                            }
                            else if (pencil === "end" && endVertex == null) {
                                vertex.setChar(optionToChar["end"]);
                                setEndVertex(vertex.id)
                            }
                            setVersion(version + 1);
                        }}
                        onMouseMove={() => {
                        if (!mouseDown) return;
                        graph.clear();

                        if (pencil === "eraser") {
                            if (vertex.getChar() === optionToChar["start"]) {
                                vertex.setChar(" ");
                                setStartVertex(null);
                            }
                            else if (vertex.getChar() === optionToChar["end"]) {
                                vertex.setChar(" ");
                                setEndVertex(null);
                            }
                            vertex.setChar(" ");
                            vertex.setActive(true);
                        }
                        else if (pencil === "wall") {
                            vertex.setChar(optionToChar["wall"]);
                            vertex.setActive(false)
                        }

                        setVersion(version + 1);
                    }}
                        className={"select-none h-8 w-4  text-2xl flex items-center justify-center "
                            + (vertex.getChar() === optionToChar["wall"] ? "text-white " : " ")
                            + (vertex.getChar() === visitedChar ? "text-yellow-500 " : " ")
                            + (vertex.getChar() === optionToChar["start"] ? "text-blue-500 " : " ")
                            + (vertex.getChar() === pathChar ? "text-green-500 " : " ")
                            + (vertex.getChar() === optionToChar["end"] ? "text-red-500 " : " ")} id={vertex.id}
                         key={vertex.id}>{

                        // Determine what to display based on regex tests
                        topLeftCorner.test(vertex.id) ||
                        topRightCorner.test(vertex.id) ||
                        bottomLeftCorner.test(vertex.id) ||
                        bottomRightCorner.test(vertex.id)
                        ? '+'
                        : leftEdge.test(vertex.id) ||
                        rightEdge.test(vertex.id)
                        ? '|'
                        : topEdge.test(vertex.id) ||
                        bottomEdge.test(vertex.id)
                        ? '—'  // Horizontal bar (em dash)
                        : vertex.getChar()
                    }</div>
                ))}
            </div>
            <div className="flex flex-row justify-between">
                <div className="grid grid-cols-4 grid-rows-1 w-fit">
                    {options.map((option, index) =>
                        <div key={`selector-${option}`} className="uppercase text-center">
                            <input className="hidden" type="radio" id={option} name="pencil" value={option}
                                   checked={pencil === option}
                                   onChange={handleRadioChange}/>
                            <label
                                className={`italic select-none font-semibold cursor-pointer size-12 border-y border-white text-2xl flex justify-center text-center items-center ${optionToColor[option]} ${
                                    index === 0 ? 'border-l' : index === options.length - 1 ? 'border-r' : ''
                                }`} htmlFor={option}>
                                {option === "eraser" ? <LuEraser/> : optionToChar[option]}
                            </label>
                            <p className={`font-normal transition-all ${(pencil === option) ? "border-t-4" : ""}`}>
                                {option}
                            </p>
                        </div>
                    )}
                </div>
                <div className="h-fit flex gap-2">
                    <button className="uppercase" onClick={() => reset()}>clear</button>
                    <button className="uppercase" onClick={() => runAStar()}>start</button>
                </div>

            </div>
        </div>
    );
}

export default ShortestPathApp
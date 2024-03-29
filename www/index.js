import { Universe, greet, Cell} from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/rusty_wasm_bg.wasm";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const width = 64;
const height = 64;
const universe = Universe.new(width, height);

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

let isStopped = false;

const draw = () => {
    drawGrid();
    drawCells();
}

const renderLoop = () => {
    universe.tick();

    draw();

    if (isStopped) {
        return;    
    }
    requestAnimationFrame(renderLoop);
};

const start = () => {
    isStopped = false;
    requestAnimationFrame(renderLoop);
}

const stop = () => {
    isStopped = true;
}

const random = () => {
    universe.set_random();

    draw();
}

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
  
    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
  
    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
  
    ctx.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};
  
const drawCells = () => {
    const cellsPtr = universe.get_cells_ptr();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
  
    ctx.beginPath();
  
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);
  
            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;
  
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
  
    ctx.stroke();
};

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const randomButton = document.getElementById("random-button");

startButton.onclick = start;
stopButton.onclick = stop;
randomButton.onclick = random;

greet("test");

draw();

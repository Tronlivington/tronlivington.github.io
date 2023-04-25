// import p5 from "p5";
import { C4Position } from "./c4.position.js";
let bgColour = 255;
let strokeColour = 0;
const p1Colour = [255, 0, 0];
const p2Colour = [0, 0, 255];
let position;
const sketch = (p5) => {
    p5.setup = () => {
        // Initialise the canvas
        const canvas = p5.createCanvas(700, 600);
        canvas.parent("app");
        p5.background(bgColour);
        // Start a new game
        position = new C4Position();
    };
    p5.draw = () => {
        // Draw the board
        position.grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                p5.stroke(strokeColour);
                p5.strokeWeight(4);
                p5.fill(bgColour);
                p5.circle(j * 100 + 50, i * 100 + 50, 80);
                if (cell === 1) {
                    p5.fill(...p1Colour);
                    p5.circle(j * 100 + 50, i * 100 + 50, 80);
                }
                else if (cell === 2) {
                    p5.fill(...p2Colour);
                    p5.circle(j * 100 + 50, i * 100 + 50, 80);
                }
            });
        });
        // Check if the game is over
        // TODO: Display game over message in p5 instead of console
        if (position.gameIsOver()) {
            if (position.winner === 0) {
                // position.log();
                // console.log("Game over, it's a draw!");
                bgColour = 0;
                strokeColour = 255;
            }
            else {
                // position.log();
                // console.log(`Game over, player ${position.winner} wins!!`);
                bgColour = 0;
                strokeColour = 255;
            }
        }
        // position.log();
    };
    p5.mouseClicked = () => {
        if (position.gameIsOver()) {
            return;
        }
        const col = Math.floor(p5.mouseX / 100);
        if (position.isValidMove(col + 1)) {
            position.move(col + 1);
            checkForGameOver();
        }
    };
    function checkForGameOver() {
        // Check if the game is over
        if (position.gameIsOver()) {
            if (position.winner === 0) {
                position.log();
                console.log("Game over, it's a draw!");
                bgColour = 0;
                strokeColour = 255;
            }
            else {
                position.log();
                console.log(`Game over, player ${position.winner} wins!!`);
                bgColour = 0;
                strokeColour = 255;
            }
        }
    }
};
new p5(sketch);

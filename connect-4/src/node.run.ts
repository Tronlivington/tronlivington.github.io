import { C4Position, C4Move } from "./c4.position.js";
import Prompt from "prompt-sync";
const prompt = Prompt();

const position = new C4Position();
while (!position.gameIsOver()) {
  position.log();
  let move = null;
  while (move === null) {
    const input = prompt(
      `Player ${position.currentPlayer} to move (1-7, q to quit): `
    );
    if (input === null) {
      continue;
    } else if (input === "q") {
      process.exit();
    }
    move = parseInt(input) as C4Move;
  }
  if (!position.isValidMove(move)) {
    console.log("Invalid move!");
    continue;
  }
  position.move(move);
}

if (position.winner === 0) {
  position.log();
  console.log("Game over, it's a draw!");
  process.exit();
} else {
  position.log();
  console.log(`Game over, player ${position.winner} wins!!`);
  process.exit();
}

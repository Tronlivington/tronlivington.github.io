import { Position } from "./position";

export type C4Grid = C4Player[][];
// export type C4Move = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type C4Move = number;
export type C4Player = 0 | 1 | 2;
export type Direction = [number, number];

const directions: Direction[] = [
  [0, 1], // right
  [1, 1], // down right
  [1, 0], // down
  [1, -1], // down left
];

export class C4Position implements Position<C4Grid, C4Move, C4Player> {
  COLS = 7;
  ROWS = 6;
  WIN_AT = 4;
  grid: C4Grid;
  depth: number;
  currentPlayer: C4Player;
  winner: C4Player;
  isOver: boolean;

  constructor(
    grid: C4Grid | null = null,
    depth: number = 0,
    currentPlayer: C4Player = 1
  ) {
    if (grid === null) {
      this.grid = [];
      this.initialise();
    } else {
      this.grid = grid;
    }
    this.depth = depth;
    this.currentPlayer = currentPlayer;
    this.winner = 0;
    this.isOver = false;
  }

  // Initialize the grid to be empty.
  initialise(): void {
    this.grid = [];
    for (let i = 0; i < this.ROWS; i++) {
      this.grid.push(new Array(this.COLS).fill(0));
    }
  }

  // Drop a piece in the given column. Return true if successful, false if not.
  move(move: C4Move): boolean {
    const col = move - 1;
    const row = this.grid
      .slice()
      .reverse()
      .findIndex((row) => row[col] === 0);
    if (row === -1) {
      return false;
    }
    this.grid[this.ROWS - row - 1][col] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    return true;
  }

  // Check if a move is valid.
  isValidMove(move: C4Move): boolean {
    const col = move - 1;
    return col >= 0 && col < this.COLS && this.grid[0][col] === 0;
  }

  // Return a list of valid moves.
  listValidMoves() {
    const validMoves: C4Move[] = [];
    for (let i = 1; i <= this.COLS; i++) {
      if (this.isValidMove(i as C4Move)) {
        validMoves.push(i as C4Move);
      }
    }
    return validMoves;
  }

  // Check if the game is over and return the winner
  gameIsOver(): boolean {
    this.winner = this.findWinningPlayer();
    if (this.winner !== 0) {
      this.isOver = true;
      return true;
    }
    if (this.checkForDraw()) {
      this.isOver = true;
      return true;
    }
    return false;
  }

  // Check if either player has won.
  findWinningPlayer(): C4Player {
    for (const direction of directions) {
      const winner = this.checkDirection(direction);
      if (winner !== 0) {
        return winner;
      }
    }
    return 0;
  }

  // Check if a game is drawn. This assumes there's no winner.
  checkForDraw(): boolean {
    return this.grid[0].every((cell) => cell !== 0);
  }

  // Check if either player has WIN_AT consecutive pieces in a given direction.
  checkDirection(direction: [number, number]): C4Player {
    const [deltaC, deltaR] = direction;
    const minC = Math.max(0, this.WIN_AT * (deltaC - 1));
    const maxC = Math.min(this.COLS - 1, this.COLS - this.WIN_AT * deltaC);
    const minR = Math.max(0, this.WIN_AT * (deltaR - 1));
    const maxR = Math.min(this.ROWS - 1, this.ROWS - this.WIN_AT * deltaR);
    for (let i = minR; i <= maxR; i++) {
      for (let j = minC; j <= maxC; j++) {
        let player = this.grid[i][j];
        let count = 0;
        if (player === 0) {
          continue;
        }
        for (let k = 0; k < this.WIN_AT; k++) {
          if (this.grid[i + k * deltaR][j + k * deltaC] !== player) {
            break;
          }
          count++;
        }
        if (count === this.WIN_AT) {
          return player;
        }
      }
    }
    return 0;
  }

  // Log the grid to the console.
  log(): void {
    this.grid.forEach((row) => console.log(row.join("|")));
  }
}

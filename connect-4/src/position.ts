export interface Position<Grid, Move, Player> {
  grid: Grid;
  depth: number;
  currentPlayer: Player;
  winner: Player | false;
  initialise: () => void;
  move: (move: Move, player: Player) => boolean;
  isValidMove: (move: Move) => boolean;
  listValidMoves: () => Move[];
  gameIsOver: () => boolean;
}

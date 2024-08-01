import { Coordinates } from "./components/GameBoard";
import { PieceType } from "./components/Piece";

export const compareCoordinates = (cordA: Coordinates, cordB: Coordinates) => cordA.x === cordB.x && cordA.y === cordB.y;
export const getCoordinate = (houses: Array<PieceType | undefined>[], coord: Coordinates) => houses[coord.y]?.[coord.x];
export const setCoordinate = (
  houses: Array<PieceType | undefined>[],
  coord: Coordinates,
  val: PieceType | undefined
) => houses[coord.y][coord.x] = val ? { ...val } : undefined
export const togglePlayer = (curr: PieceType['player']) : PieceType['player'] => curr === 'top' ? 'bottom' : 'top'
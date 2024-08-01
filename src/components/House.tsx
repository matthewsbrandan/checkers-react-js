import { compareCoordinates } from "../utils";
import { Coordinates, SelectedPiece } from "./GameBoard";
import { Piece, PieceType } from "./Piece"

interface HouseProps{
  odd: boolean,
  house: PieceType | undefined,
  currentPlayer: PieceType['player'] | undefined,
  selectedPiece: SelectedPiece | undefined,
  coordinates: Coordinates,
  onSelect: (coord: Coordinates) => void
}
export const House = ({ odd, house, currentPlayer, selectedPiece, coordinates, onSelect }:HouseProps) => {
  const is_current_player = house?.player === currentPlayer
  const is_available_target = !!(selectedPiece && selectedPiece.available_targets.some(
    (coord) => compareCoordinates(coord, coordinates)
  ))
  const is_disabled = !currentPlayer || (!is_current_player && !is_available_target);

  return (
    <button
      className={`flex items-center justify-center w-16 h-16 ${odd ? 'bg-gray-600':'bg-gray-900'} ${
        is_disabled ? 'opacity-50' : is_available_target ? 'brightness-150' : ''
      }`}
      onClick={() => onSelect(coordinates)}
      disabled={is_disabled}
    >{house && <Piece {...house}/>}</button>
  )
}
  
import { Coordinates } from "./GameBoard"

export interface PieceType{
  coordinates: Coordinates,
  player: 'top' | 'bottom',
  is_promoted?: boolean
}
export const Piece = ({ player, is_promoted }: PieceType) => (
  <span className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow-md font-semibold ${
    is_promoted ? ' shadow-red-200/80':''
  } ${
    player === 'top' ?'text-gray-500 bg-gray-800/80 border-gray-950/80':'text-gray-500 bg-gray-100/80 border-gray-400/80'
  }`}>
    {is_promoted && 'D'}
  </span>
)
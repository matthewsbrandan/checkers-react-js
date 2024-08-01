import { Fragment } from "react/jsx-runtime"
import { PieceType } from "./Piece"
import { useState } from "react"
import { House } from "./House"
import { compareCoordinates, getCoordinate, setCoordinate, togglePlayer } from "../utils"

const MIN_INDEX = 0;
const MAX_INDEX = 7;
export type Coordinates = { x: number, y: number }
export interface SelectedPiece{
  coordinates: Coordinates,
  available_targets: Coordinates[],
  possible_deaths : PossibleDeaths[]
}
interface PossibleDeaths{ to_kill: Coordinates, target: Coordinates }
export const GameBoard = () => {
  const [houses, setHouses] = useState<Array<PieceType | undefined>[]>(Array.from({ length: MAX_INDEX + 1 }).map((_,y) => [
    ...Array.from({ length: MAX_INDEX + 1 }).map((_, x) => [0,1, MAX_INDEX - 1, MAX_INDEX].includes(y) ? {
      player: y === 0 || y === 1 ? 'top' : 'bottom',
      coordinates: { x, y }
    } as PieceType: undefined)
  ] as (PieceType | undefined)[]))

  const [currentPlayer, setCurrentPlayer] = useState<PieceType['player']>('bottom');
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece>();

  function onSelectPiece(coordinates: Coordinates){
    const curr = getCoordinate(houses, coordinates)
    if(!curr){
      if(selectedPiece && selectedPiece.available_targets.some(
        coord => compareCoordinates(coord, coordinates)
      )){
        setHouses((prevState) => {
          let newState = [...prevState];

          let current = getCoordinate(newState, selectedPiece.coordinates);
          if(!current) return prevState;

          let is_promoted = current.is_promoted || (
            (coordinates.y === MIN_INDEX && currentPlayer === 'bottom') ||
            (coordinates.y === MAX_INDEX && currentPlayer === 'top')
          );
          
          setCoordinate(newState, coordinates, {
            ...current,
            coordinates,
            is_promoted
          });

          setCoordinate(newState, selectedPiece.coordinates, undefined);

          const toKill = selectedPiece.possible_deaths.find((possible) => compareCoordinates(possible.target, coordinates));

          if(toKill) setCoordinate(newState, toKill.to_kill, undefined);

          return newState;
        });

        setCurrentPlayer(togglePlayer(currentPlayer))

        setSelectedPiece(undefined)
      }

      return;
    }

    const { is_promoted } = curr
    let available_targets : Coordinates[] = [];
    let possible_deaths : PossibleDeaths[] = [];
  
    const hasPrev = (val: number) => val > MIN_INDEX;
    const hasNext = (val: number) => val < MAX_INDEX;

    /**
     * t = top, m = middle, b = bottom, l = left, r = right
     * 
     * ```
     * tl | tm | tr
     * ml |    | mr
     * bl | bm | br
     * ```
     */
    const tryToKillOpponent = ({ opponent, vertical, horizontal }:{
      opponent: PieceType,
      vertical: 't' | 'm' | 'b',
      horizontal: 'l' | 'm' | 'r'
    }) => {
      if(!currentPlayer || opponent.player === currentPlayer) return;
      
      let target_y = opponent.coordinates.y;
      let target_x = opponent.coordinates.x;

      if(vertical === 't'){
        if(opponent.coordinates.y === MIN_INDEX) return;
        target_y = opponent.coordinates.y - 1;
      }
      if(vertical === 'b'){
        if(opponent.coordinates.y === MAX_INDEX) return;
        target_y = opponent.coordinates.y + 1;
      }
      if(horizontal === 'l'){
        if(opponent.coordinates.x === MIN_INDEX) return;
        target_x = opponent.coordinates.x - 1;
      }
      if(horizontal === 'r'){
        if(opponent.coordinates.x === MAX_INDEX) return;
        target_x = opponent.coordinates.x + 1;
      }

      let target = { x: target_x, y: target_y };
      if(getCoordinate(houses, target)) return;

      available_targets.push({ ...target });
      possible_deaths.push({
        target: { ...target },
        to_kill: { ...opponent.coordinates }
      })
    }
    const verifyCoordY = (x: number, horizontal: 'l' | 'm' | 'r') => {
      let target = { x, y: coordinates.y };

      const targetCoord = getCoordinate(houses, target);
      if(!targetCoord) available_targets.push({ ...target });
      else tryToKillOpponent({
        opponent: targetCoord,
        vertical: 'm',
        horizontal,
      })
        
      if(hasPrev(coordinates.y)){
        let prevY = coordinates.y - 1;
        target.y = prevY;

        const targetCoord = getCoordinate(houses, target);
        if(!targetCoord){
          if(is_promoted || currentPlayer === 'bottom') available_targets.push({ ...target });
        }else tryToKillOpponent({
          opponent: targetCoord,
          vertical: 't',
          horizontal,
        })
      }
      if(hasNext(coordinates.y)){
        let nextY = coordinates.y + 1;
        target.y = nextY;

        const targetCoord = getCoordinate(houses, target);
        if(!targetCoord){
          if(is_promoted || currentPlayer === 'top') available_targets.push({ ...target });
        } else tryToKillOpponent({
          opponent: targetCoord,
          vertical: 'b',
          horizontal,
        })
      }
    }
    
    verifyCoordY(coordinates.x, 'm');

    if(hasPrev(coordinates.x)){
      let prevX = coordinates.x - 1;
      verifyCoordY(prevX, 'l');
    }
    if(hasNext(coordinates.x)){
      let nextX = coordinates.x + 1;
      verifyCoordY(nextX, 'r');
    }

    setSelectedPiece({ coordinates, available_targets, possible_deaths })
  }

  return (
    <div className="grid grid-cols-8 w-fit my-4">
      {houses.map((row, y) => (
        <Fragment key={y}>
          {row.map((house, x) => (
            <Fragment key={x}>
              <House
                odd={(x + y) % 2 !== 0}
                onSelect={onSelectPiece}
                currentPlayer={currentPlayer}
                selectedPiece={selectedPiece}
                coordinates={{ x, y }}
                house={house}
              />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  )
}
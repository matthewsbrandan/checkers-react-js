import { GameBoard } from "./components/GameBoard"

function App() {
  return (
    <main className="bg-gray-950 flex justify-center items-center h-screen w-screen">
      <div>
        <h1 className="font-semibold text-2xl text-center mb-2 text-gray-400">Checkers</h1>
        <GameBoard/>     
      </div>
    </main>
  )
}

export default App

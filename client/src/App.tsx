import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ticket Manager
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Phase 1: Core Infrastructure Complete ✓
        </p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Count is {count}
        </button>
        <div className="mt-8 text-sm text-gray-500">
          <p>✓ Backend: FastAPI + PostgreSQL</p>
          <p>✓ Frontend: Vite + React + TypeScript</p>
          <p>✓ Styling: Tailwind CSS</p>
          <p>✓ Database: Migrations applied</p>
        </div>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { UploadVideo } from './views/Uploadvideo.jsx'

function App() {
  const [count, setCount] = useState(0)

  return ( <UploadVideo />
  )
}

export default App

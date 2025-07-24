import React from 'react'
import './App.css'
import FileUpload from './Components/fileUpload.jsx'
import Home from './Routes/Home.jsx'
import FileManage from './Routes/FileMange.jsx'
import { Route, Routes } from 'react-router-dom'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/filemanage" element={<FileManage/>}/>
      <Route path="*" element={'Invalid Route'}/>
    </Routes>
  )
}

export default App;

import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { UserContextData } from './context/UserContext'
import Network from './components/Network'
import Profile from './components/Profile'
import Notification from './components/Notification'

function App() {
  let {UserData} = useContext(UserContextData)
  return (
    <Routes>
      <Route path='/' element={UserData?<Home/>:<Navigate to={'/login'}/>}/>
      <Route path='/login' element={UserData?<Navigate to={'/'}/>:<Login/>}/>
      <Route path='/signup' element={UserData?<Navigate to={'/'}/>:<SignUp/>}/>
      <Route path='/network' element={UserData?<Network/>:<Navigate to={'/login'}/>}/>
      <Route path='/profile' element={UserData?<Profile/>:<Navigate to={'/login'}/>}/>
      <Route path='/notification' element={UserData?<Notification/>:<Navigate to={'/login'}/>}/>
    </Routes>
  )
}

export default App
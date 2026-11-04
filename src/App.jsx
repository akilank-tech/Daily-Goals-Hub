import './App.css'
import Login from './login'
import Signup from './signin'
import Landing from './landing'
import {useState} from 'react'
import { BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  const[users,setusers]=useState(
        [
            {
                username:"akil",
                password:"123"
            }
        ]
    )
  return (
   <div>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login users={users} setusers={setusers}/>}></Route>
      <Route path='/signin' element={<Signup users={users} setusers={setusers}/>}></Route>
      <Route path='/landing' element={<Landing/>}></Route>
    </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App

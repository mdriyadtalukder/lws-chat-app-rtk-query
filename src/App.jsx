
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Conversation from './pages/Conversation'
import Inbox from './pages/Inbox'
import useAuthCheck from './hook/useAuthCheck'
import Private from './components/Private'
import Public from './components/Public'

function App() {
  const authChecked = useAuthCheck();

  return !authChecked ? ('Auth checking...') : (<>
    <Routes>
      <Route path="/" element={<Public><Login /></Public>} />
      <Route path="/register" element={<Public><Register /></Public>} />
      <Route path="/inbox" element={<Private><Conversation /></Private>} />
      <Route path="/inbox/:id" element={<Private><Inbox /></Private>} />
    </Routes>
  </>

  )
}

export default App

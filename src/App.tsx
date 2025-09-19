import './App.css'
import { Routes, Route, Navigate} from "react-router"
import Login from './pages/Login'
import Dashboad from './components/layout/Dashboad'
import ClientList from './pages/ClientList'
import Create from './pages/Create'
import CardList from './pages/CardList'

import AdminRoutes from './components/routes/AdminRoutes'
import Unauthorized from './pages/Unauthorized'
import Profile from './pages/Profile'
import Success from './pages/Success'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/secure-login" replace />} />
      <Route path="/user/secure-login" element={<Login/>} />
      <Route path='/dashboard' element={
      <AdminRoutes>
        <Dashboad/>
      </AdminRoutes>
      }>
      {/* <Route path='/dashboard' element={<Dashboad/>}> */}
        <Route path='create-client' element={<Create/>} />
        <Route path='client-list' element={<ClientList/>} />
        <Route path='card-list' element={<CardList/>} />
      </Route>
      <Route path='/unauthorized' element={<Unauthorized/>} />
      <Route path="/receiver/:id/confirmation-gateway" element={<Profile />} />
      <Route path="/confirmation-gateway/processing" element={<Success />} />

    </Routes>
  )
}

export default App

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import PrivateRoute from './components/misc/PrivateRoute'
import Navbar from './components/misc/Navbar'
import Home from './components/home/Home'
import Login from './components/home/Login'
import Signup from './components/home/Signup'
import OAuth2Redirect from './components/home/OAuth2Redirect'
import AdminPage from './components/admin/AdminPage'
import UserPage from './components/user/UserPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/oauth2/redirect' element={<OAuth2Redirect />} />
          <Route path="/adminpage" element={<PrivateRoute><AdminPage /></PrivateRoute>}/>
          <Route path="/userpage" element={<PrivateRoute><UserPage /></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

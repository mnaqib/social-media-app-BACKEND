import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import './semantic/dist/semantic.min.css'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MenuBar from './components/MenuBar'
import { AuthProvider } from './context/auth'
import getAuth from './util/getAuth'
import SinglePost from './pages/SinglePost'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/login"
              element={getAuth().user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              exact
              path="/register"
              element={getAuth().user ? <Navigate to="/" /> : <Register />}
            />
            <Route exact path="/posts/:id" element={<SinglePost />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

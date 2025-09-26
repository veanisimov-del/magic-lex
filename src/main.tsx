import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import Home from './pages/Home'
import Train from './pages/Train'
import Decks from './pages/Decks'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import Achievements from './pages/Achievements'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home /> },
    { path: 'train', element: <Train /> },
    { path: 'decks', element: <Decks /> },
    { path: 'onboarding', element: <Onboarding /> },
    { path: 'profile', element: <Profile /> },
    { path: 'achievements', element: <Achievements /> },
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App.tsx'
import CreateHeroPage from './pages/create-hero/CreateHeroPage.tsx'

const router = createBrowserRouter([
  {
    path: "/", 
    element: <App/>,
    children: [
      { path: "/", element: <h1>Hello world</h1> },
      { path: "/create", element: <CreateHeroPage/> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

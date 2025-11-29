import React from 'react'
import ReactDOM from 'react-dom/client'
import './list.css'
import App from './App'
import CustomerList from './CustomerList'
import TrainingList from './TrainingList'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <div className = "section-title">Welcome to Client App!</div> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'trainings', element: <TrainingList /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

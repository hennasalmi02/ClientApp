import './App.css'
import { Link, Outlet } from 'react-router'

function App() {

  return (
    <>
      <nav className="top-nav">
        <Link to="/">Home</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/trainings">Trainings</Link>
      </nav>
      <Outlet />
    </>
  )
}

export default App

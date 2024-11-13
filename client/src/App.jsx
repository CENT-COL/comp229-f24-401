import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Services from './pages/services';
import ProjectList from './pages/project-list';
import Register from './pages/register';
import Login from './pages/login';
import ProjectDetails from './pages/project-details';

function App() {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token && username ? { username } : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ username });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  }

  return (
    <>
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className='navbar-brand' to="/">My Portfolio</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className='nav-link' to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/projects">Projects</Link>
              </li>
              <li className="nav-item">
                  <Link className='nav-link' to="/contact">Contact</Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              {user ? (
                <>
                  <li className="nav-item">
                  <span className="navbar-text mr-3">Welcome, {user.username}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline secondary" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ): (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              )}
              
            </ul>
          </div>
        </nav>
      </div>


      <Routes>
        <Route path="/" element = {<Home />} />
        <Route path="/about" element = {<About/>} />
        <Route path="/contact" element = {<Contact />} />
        <Route path="/services" element = {<Services />} />
        <Route path="/projects" element = { <ProjectList />} />
        <Route path="/project-details" element = { <ProjectDetails />} />
        <Route path="/project-details/:id" element = { <ProjectDetails />} />
        <Route path="/register" element = { <Register />} />
        <Route path="/login" element = { <Login setUser={setUser} />} />

      </Routes>
    </Router>
    </>
  )
}

export default App

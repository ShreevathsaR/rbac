import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectsBar from './ProjectsBar';

const Home = () => {

    const navigate = useNavigate();

        const token = localStorage.getItem('token');
        if(!token){
            return navigate('/')
        }

    const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('ownerID')
    navigate('/')
}
  return (
    <div>
      <h1>Welcome Home!</h1>
      <button onClick={()=>handleLogout()}>Logout</button>
      <ProjectsBar />
    </div>
  )
}

export default Home

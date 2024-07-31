import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome Home!</h1>
      <button onClick={()=>{navigate('/')}}>Logout</button>
    </div>
  )
}

export default Home

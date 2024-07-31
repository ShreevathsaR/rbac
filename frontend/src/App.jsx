import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [users, setUsers] = useState([])
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [formType, setFormType] = useState('')

  useEffect(() => {

    axios.get('http://localhost:5000/users').then(users => {
      setUsers(users.data);
    })
      .catch(err => {
        console.log(err)
      })
  }, [users])


  return (
    <div>
      {formType == '' && (
        <>
          <h1>Welcome!!</h1>
          <a style={{ paddingRight: "2rem", cursor: "pointer" }} onClick={() => { setFormType("Signup") }}>SignUp</a>
          <a style={{ cursor: "pointer" }} onClick={() => { setFormType("Login") }}>Login</a>
          <div>
            {
              users.map((user) => {
                return <h3>{user.email}</h3>
              })
            }
          </div>
        </>
      )}
      {formType == 'Signup' && (
        <Signup setFormType={setFormType}/>
      )}
      {formType == 'Login' && (
        <Login setFormType={setFormType}/>
      )}
      {formType == 'Home' && (
        <Home />
      )}
    </div>
  )
}

export default App

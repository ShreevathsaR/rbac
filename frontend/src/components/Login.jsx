import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    
    const handleSubmit = () => {

        if (email == '' || password == '') {
            setMessage('Fill all fields!!')
            return
        }

        axios.post('http://localhost:5000/login', { email, password })
            .then(() => {
                setMessage(`Logged in successfully ${email}!!`)
                setFormType('Home');
            })
            .catch(err => {
                console.log(err)
                setMessage("Login failed!")
            })
    }

    return (
        <div>
            <h1>Login Page</h1>
            <input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}></input>
            <input placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
            <button onClick={() => { handleSubmit() }}>Submit</button>
            <div>
                {message}
            </div>
        </div>
    )
}

export default Login

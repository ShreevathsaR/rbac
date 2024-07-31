import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = ({setFormType}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [token,setToken] = useState('')
    const navigate = useNavigate();


    const handleSubmit = () => {

        if (email == '' || password == '') {
            setMessage('Fill all fields!!')
            return
        }

        axios.post('http://localhost:5000/login', { email, password })
            .then((res) => {
                // console.log(res.data.accessToken)
                setToken(res.data.accessToken)
                setMessage(`Logged in successfully ${email}!!`)
                // navigate('/home')
            })
            .catch(err => {
                console.log(err)
                setMessage("Login failed!")
            })
    }

    const accessProtectedRoute = () => {
        if (!token) {
            setMessage("No token found!");
            return;
        }
    
        axios.get('http://localhost:5000/protected', {
            headers: {
                Authorization: token 
            }
        })
        .then(response => {
            console.log(response.data); // Should print the response data
            setMessage("Access granted to protected route");
        })
        .catch(err => {
            console.error(err);
            setMessage("Failed to access protected route!");
        });
    };

    return (
        <div>
            <h1>Login Page</h1>
            <input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}></input>
            <input placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
            <button onClick={() => { handleSubmit() }}>Submit</button>
            <div>
                <a onClick={() => { setFormType('') }}>Go Back</a>
            </div>
            <div>
                {message}
            </div>
            <h2>Protected Route</h2>
            <button onClick={()=>{accessProtectedRoute()}}>Access Protected Route</button>
        </div>
    )
}

export default Login

import React, { useState } from 'react'
import axios from 'axios'

const Signup = ({setFormType}) => {

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = () => {
        axios.post('http://localhost:5000/createUser', { email, password })
            .then(users => {
                setMessage(`Signup Successful!! ${email}`)
                console.log(users);
            })
            .catch(err => {
                console.log(err)
                setMessage(err)
            })
    }

    return (
        <div>
            <h1>Signup Page</h1>
            <input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}></input>
            <input placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
            <button onClick={() => { handleSubmit() }}>Submit</button>
            <div>
                <a onClick={()=>{setFormType('')}}>Go Back</a>
            </div>
            <div>
                {message}
            </div>
        </div>
    )
}

export default Signup

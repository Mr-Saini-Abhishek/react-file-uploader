import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const {showAlert} = props;
    const [credentials, setCredentials] = useState({ email: "", password: "",  name: "", cpassword: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;
        
        if (password !== cpassword) {
            alert("Passwords do not match");
            return;
        }
    
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const json = await response.json();
        console.log(json)
        
        if (json.success) {
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Account Created Successfully", "success");

        } else {
            props.showAlert("Invaild Credentials", "danger");
        }

    }
    
    

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Name</label>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={credentials.name} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
                   
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={credentials.password} onChange={onChange} />
                </div>
            
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" placeholder="Confirm Password" value={credentials.cpassword} onChange={onChange} />
                </div>
               
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default Login;

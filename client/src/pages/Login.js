import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
// import { LOGIN_USER } from '../utils/mutations';
import "../styling/Login.css"
// import Auth from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  // const [login, { error, data }] = useMutation(LOGIN_USER);

 
  const handleChange = (event) => { // update state based on form input changes
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

 
//   const handleFormSubmit = async (event) => { // submit form
//     event.preventDefault();
//     // console.log(formState);
//     try {
//       const { data } = await login({
//         variables: { ...formState },
//       });

// //     // Auth.login(data.login.token);
//     } 
//     catch (e) {
//       console.error(e);
//     }}

   
//     setFormState({ // clears form after submitted
//       email: '',
//       password: '',
//     });
//   };
// console.log("test");
  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Login</h4>
          <div className="card-body">
              <form >
                <input
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Enter you password"
                  name="password"
                  type="password"
                
                  onChange={handleChange}
                />
                <button
                  className="btn btn-block btn-info"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
         

            
              <div className="my-3 p-3 bg-danger text-white">
                
              </div>
          
          </div>
        </div>
      </div>
    </main>
    
  );

};

export default Login;

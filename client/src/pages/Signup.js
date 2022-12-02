import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import "../styling/Signup.css"
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  // const [addProfile, { error, data }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log(formState);

  //   try {
  //     const { data } = await addProfile({
  //       variables: { ...formState },
  //     });

  //     Auth.login(data.addProfile.token);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <main className="flex-row justify-center mb-4">
      <center>
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
          <div className="card-body">
           
              <form>
                <input
                  className="form-input"
                  placeholder="Your username"
                  name="name"
                  type="text"

                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"

                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="******"
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
              <div><h5>"It's so easy to fall in love but hard to find someone who will catch you."</h5></div>
          </div>
        </div>
      </div>
      </center>
    </main>
  );
 
};

export default Signup;

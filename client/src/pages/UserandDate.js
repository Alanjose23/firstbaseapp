import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useMutation } from '@apollo/client';
import "../styling/UserandDate.css"
// import { ADD_SKILL } from '../utils/mutations';

import Auth from '../utils/auth';

const DateForm = ({ profileId }) => {
  const [skill, setDate] = useState('');
  const [journal, setJournal] = useState('');

  // const [addSkill, { error }] = useMutation(ADD_SKILL);

  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const data = await addSkill({
  //       variables: { profileId, skill },
  //     });

  //     setSkill('');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div>
      <h4>Endorse some Favorite Dates</h4>
        <form
          className="flex-row justify-center justify-space-between-md align-center"
        >
          <div className="col-12 col-lg-9">
            <input
              placeholder="Endorse some dates..."
              value={skill}
              className="form-input w-100"
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-block py-3" type="submit">
              Endorse Dates
            </button>
          </div>
        
        </form>
        <h4>Endorse some future Dates below.</h4>
        <form
          className="flex-row justify-center justify-space-between-md align-center"
        >
          <div className="col-12 col-lg-9">
            <input
              placeholder="Endorse some dates..."
              value={journal}
              className="form-input w-100"
              onChange={(event) => setJournal(event.target.value)}
            />
          </div>

          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-block py-3" type="submit">
              Endorse Skill
            </button>
          </div>
        
        </form>
    </div>
    
  );

};

export default DateForm;

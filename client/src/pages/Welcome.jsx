import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_PROFILE } from '../utils/mutations';
import Auth from '../utils/auth';
import '../styling/Welcome.css';

const GENDER_OPTIONS = [
  { id: 'man',       label: 'Man',        emoji: '👨' },
  { id: 'woman',     label: 'Woman',      emoji: '👩' },
  { id: 'nonbinary', label: 'Non-binary', emoji: '🌈' },
  { id: 'other',     label: 'Other',      emoji: '✦'  },
];

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) window.location.assign('/login');
  }, []);

  const { data, loading } = useQuery(QUERY_ME);
  const me = data?.me;

  const [step, setStep]             = useState(1);
  const [gender, setGender]         = useState('');
  const [lookingFor, setLookingFor] = useState([]);

  // Pre-fill for users revisiting the screen
  useEffect(() => {
    if (me) {
      setGender((g) => g || me.gender || '');
      setLookingFor((lf) => (lf.length ? lf : me.lookingFor ?? []));
    }
  }, [me]);

  const [updateProfile, { loading: saving, error }] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const toggleLookingFor = (id) =>
    setLookingFor((lf) => (lf.includes(id) ? lf.filter((x) => x !== id) : [...lf, id]));

  const handleFinish = async () => {
    await updateProfile({ variables: { gender, lookingFor } });
    navigate('/user');
  };

  if (loading) return <div className="loading-text">Loading…</div>;

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-progress">
          <span className={`welcome-dot${step === 1 ? ' active' : ' done'}`} />
          <span className={`welcome-dot${step === 2 ? ' active' : ''}`} />
        </div>

        {step === 1 ? (
          <>
            <h2>Welcome to First Base ♥</h2>
            <p className="welcome-subtitle">First things first — I am a…</p>
            <div className="welcome-options">
              {GENDER_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`welcome-option${gender === o.id ? ' selected' : ''}`}
                  onClick={() => setGender(o.id)}
                >
                  <span className="welcome-option-emoji">{o.emoji}</span>
                  <span className="welcome-option-label">{o.label}</span>
                </button>
              ))}
            </div>
            <div className="welcome-actions">
              <button className="btn-primary" disabled={!gender} onClick={() => setStep(2)}>
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Who are you looking for?</h2>
            <p className="welcome-subtitle">Pick as many as you like — we'll only show you mutual matches.</p>
            <div className="welcome-options">
              {GENDER_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`welcome-option${lookingFor.includes(o.id) ? ' selected' : ''}`}
                  onClick={() => toggleLookingFor(o.id)}
                >
                  <span className="welcome-option-emoji">{o.emoji}</span>
                  <span className="welcome-option-label">{o.label}</span>
                  {lookingFor.includes(o.id) && <span className="welcome-option-check">✓</span>}
                </button>
              ))}
            </div>
            <div className="welcome-actions">
              <button className="btn-secondary" type="button" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="btn-primary"
                disabled={!lookingFor.length || saving}
                onClick={handleFinish}
              >
                {saving ? 'Saving…' : "Let's go ♥"}
              </button>
            </div>
          </>
        )}

        {error && <div className="alert-error">{error.message}</div>}

        <button className="welcome-skip" type="button" onClick={() => navigate('/user')}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

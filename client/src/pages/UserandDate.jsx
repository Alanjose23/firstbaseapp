import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_DISCOVER } from '../utils/queries';
import {
  UPDATE_PROFILE,
  SEND_REQUEST,
  ACCEPT_REQUEST,
  DECLINE_REQUEST,
  REMOVE_CONNECTION,
} from '../utils/mutations';
import Auth from '../utils/auth';
import '../styling/UserandDate.css';

/* ── Helpers ─────────────────────────────────────────────── */
const COLORS = ['#8A3033', '#9E4245', '#7D3538', '#B05560', '#6B2326'];
const avatarColor = (str = '') => {
  const n = [...str].reduce((s, c) => s + c.charCodeAt(0), 0);
  return COLORS[n % COLORS.length];
};
const initial = (name, email) =>
  (name?.trim() ? name.trim()[0] : email?.[0] ?? '?').toUpperCase();

/* ── TagEditor sub-component ─────────────────────────────── */
function TagEditor({ tags = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  };

  return (
    <div className="tag-editor">
      {tags.map((t) => (
        <span key={t} className="tag-editor-chip">
          {t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); add(); }
          if (e.key === ',' )    { e.preventDefault(); add(); }
        }}
      />
    </div>
  );
}

/* ── Date ideas data ─────────────────────────────────────── */
const IDEAS = [
  // Couple
  { id: 1,  emoji: '🌅', title: 'Sunrise Hike',        desc: 'Hit a trail before sunrise. Bring coffee and watch the city wake up.',           cat: 'Couple'      },
  { id: 2,  emoji: '🍕', title: 'Cook Together',        desc: 'Pick a recipe neither of you has made. Tackle it. Fail together.',                cat: 'Couple'      },
  { id: 3,  emoji: '🎨', title: 'Paint Night',          desc: 'Set up canvases at home, open wine, and laugh at the results.',                   cat: 'Couple'      },
  { id: 4,  emoji: '⭐', title: 'Stargazing',           desc: 'Find a dark spot, bring a blanket, and name constellations badly.',               cat: 'Couple'      },
  { id: 5,  emoji: '🌿', title: 'Botanical Garden',     desc: 'Pack a picnic, find a quiet corner, and stay until they kick you out.',           cat: 'Couple'      },
  { id: 6,  emoji: '📚', title: 'Bookshop Wander',      desc: 'Each pick a book for the other. No hints. Swap and read aloud later.',            cat: 'Couple'      },
  { id: 7,  emoji: '🚴', title: 'Bike the City',        desc: 'Rent bikes, no map — just turn wherever looks interesting.',                       cat: 'Couple'      },
  { id: 8,  emoji: '🎬', title: 'Drive-In Movie',       desc: 'Old-school cinema with snacks you smuggled in your hoodie.',                      cat: 'Couple'      },
  { id: 9,  emoji: '🍷', title: 'Wine Tasting',         desc: 'Visit a local vineyard or wine bar and pretend to know what you\'re tasting.',    cat: 'Couple'      },
  { id: 10, emoji: '🌊', title: 'Kayaking',             desc: 'Rent a tandem kayak and discover who\'s actually in charge.',                     cat: 'Couple'      },
  // Double Date
  { id: 11, emoji: '🎳', title: 'Bowling Night',        desc: 'Four people, two lanes, one trophy argument. Perfect double date.',               cat: 'Double Date' },
  { id: 12, emoji: '🧩', title: 'Board Game Café',      desc: 'Pick a game none of you have played. Alliances will fracture.',                   cat: 'Double Date' },
  { id: 13, emoji: '🏖️', title: 'Beach Volleyball',    desc: 'Couples vs. couples. The losers buy dinner.',                                      cat: 'Double Date' },
  { id: 14, emoji: '🍻', title: 'Trivia Night',         desc: 'Form a team, destroy strangers, bicker lovingly about wrong answers.',            cat: 'Double Date' },
  { id: 15, emoji: '🎡', title: 'Amusement Park',       desc: 'Roller coasters, funnel cake, and finding out who screams loudest.',              cat: 'Double Date' },
  { id: 16, emoji: '🛶', title: 'Canoe Trip',           desc: 'Pack lunch, rent canoes, race each other down the river.',                        cat: 'Double Date' },
  { id: 17, emoji: '🏌️', title: 'Mini Golf',           desc: 'Perfectly competitive, never takes itself seriously. Ideal.',                     cat: 'Double Date' },
  // Nightlife
  { id: 18, emoji: '🎵', title: 'Jazz Club Night',      desc: 'Low lights, good drinks, live music. Dress up a little.',                         cat: 'Nightlife'   },
  { id: 19, emoji: '💃', title: 'Salsa Lesson',         desc: 'Take a beginners class together. Neither of you will be graceful. That\'s fine.', cat: 'Nightlife'   },
  { id: 20, emoji: '🎤', title: 'Karaoke Night',        desc: 'Commit fully to whatever song you pick. This is not a drill.',                    cat: 'Nightlife'   },
  { id: 21, emoji: '🍸', title: 'Cocktail Class',       desc: 'Learn three cocktails from a proper bartender, then make them badly at home.',    cat: 'Nightlife'   },
  { id: 22, emoji: '🎭', title: 'Comedy Club',          desc: 'Laugh so hard you cry. Check the lineup first — trust.',                          cat: 'Nightlife'   },
  { id: 23, emoji: '🎰', title: 'Casino Night',         desc: 'Dress up, set a spend limit, and see who\'s the better poker face.',              cat: 'Nightlife'   },
  { id: 24, emoji: '🏛️', title: 'Museum After Dark',   desc: 'Many museums host evening events. Way more atmospheric than daytime.',            cat: 'Nightlife'   },
];

const CATEGORIES = ['All', 'Couple', 'Double Date', 'Nightlife'];

const REFETCH = { refetchQueries: [{ query: QUERY_ME }, { query: QUERY_DISCOVER }] };

/* ── Main component ──────────────────────────────────────── */
export default function NetworkPage() {
  /* ── auth guard ── */
  useEffect(() => {
    if (!Auth.loggedIn()) window.location.assign('/login');
  }, []);

  /* ── queries ── */
  const { data: meData,      loading: meLoading      } = useQuery(QUERY_ME);
  const { data: discoverData, loading: discoverLoading } = useQuery(QUERY_DISCOVER);
  const me        = meData?.me;
  const discover  = discoverData?.discoverUsers ?? [];

  /* ── mutations ── */
  const [updateProfile] = useMutation(UPDATE_PROFILE,   { refetchQueries: [{ query: QUERY_ME }] });
  const [sendRequest]   = useMutation(SEND_REQUEST,     REFETCH);
  const [acceptRequest] = useMutation(ACCEPT_REQUEST,   REFETCH);
  const [declineRequest]= useMutation(DECLINE_REQUEST,  REFETCH);
  const [removeConn]    = useMutation(REMOVE_CONNECTION, REFETCH);

  /* ── profile edit state ── */
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const openEdit = () => {
    setForm({
      name:         me?.name         ?? '',
      age:          me?.age          ?? '',
      ageRangeMin:  me?.ageRangeMin  ?? 18,
      ageRangeMax:  me?.ageRangeMax  ?? 99,
      bio:          me?.bio          ?? '',
      interests:    me?.interests    ?? [],
      favoriteShows: me?.favoriteShows ?? [],
    });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const vars = {
      ...form,
      age:         form.age  ? Number(form.age)  : undefined,
      ageRangeMin: Number(form.ageRangeMin),
      ageRangeMax: Number(form.ageRangeMax),
    };
    await updateProfile({ variables: vars });
    setEditing(false);
  };

  /* ── date ideas state ── */
  const [activeCat, setActiveCat] = useState('All');
  const [savedIdeas, setSavedIdeas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fb_ideas') || '[]'); }
    catch { return []; }
  });

  const toggleIdea = (id) => {
    const next = savedIdeas.includes(id)
      ? savedIdeas.filter((i) => i !== id)
      : [...savedIdeas, id];
    setSavedIdeas(next);
    localStorage.setItem('fb_ideas', JSON.stringify(next));
  };

  const filteredIdeas = activeCat === 'All' ? IDEAS : IDEAS.filter((i) => i.cat === activeCat);

  if (meLoading) return <div className="loading-text">Loading your profile…</div>;

  return (
    <div className="network-page">
      <div className="network-container">

        {/* ── My Profile ── */}
        <div className="section-card">
          <div className="profile-top">
            <div className="profile-avatar-lg"
              style={{ background: me ? avatarColor(me.email) : 'var(--primary)' }}>
              {initial(me?.name, me?.email)}
            </div>
            <div className="profile-meta">
              <div className="profile-name">{me?.name || 'Set your name →'}</div>
              <div className="profile-email-sub">{me?.email}</div>
              <div className="profile-stats">
                <span>{me?.connections?.length ?? 0}</span> connection{me?.connections?.length !== 1 ? 's' : ''}
                {me?.age && <>&nbsp;·&nbsp;<span>{me.age}</span> yrs</>}
              </div>
            </div>
            {!editing && (
              <button className="btn-secondary" onClick={openEdit}>Edit Profile</button>
            )}
          </div>

          {editing ? (
            <form className="edit-profile-form" onSubmit={handleSave}>
              <div className="field-row">
                <div className="field-group">
                  <label>Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name" />
                </div>
                <div className="field-group">
                  <label>Age</label>
                  <input type="number" min={18} max={100}
                    value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g. 28" />
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Looking for (min age)</label>
                  <input type="number" min={18} max={99}
                    value={form.ageRangeMin} onChange={(e) => setForm({ ...form, ageRangeMin: e.target.value })}/>
                </div>
                <div className="field-group">
                  <label>Looking for (max age)</label>
                  <input type="number" min={18} max={99}
                    value={form.ageRangeMax} onChange={(e) => setForm({ ...form, ageRangeMax: e.target.value })}/>
                </div>
              </div>

              <div className="field-group">
                <label>Bio</label>
                <textarea value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell people about yourself…" maxLength={300} />
              </div>

              <div className="field-group">
                <label>Interests (Enter or comma to add)</label>
                <TagEditor tags={form.interests} placeholder="e.g. Hiking"
                  onChange={(v) => setForm({ ...form, interests: v })} />
              </div>

              <div className="field-group">
                <label>Favourite Shows (Enter or comma to add)</label>
                <TagEditor tags={form.favoriteShows} placeholder="e.g. The Bear"
                  onChange={(v) => setForm({ ...form, favoriteShows: v })} />
              </div>

              <div className="edit-actions">
                <button className="btn-primary" type="submit"
                  style={{ marginTop: 0, width: 'auto', padding: '0.7rem 1.75rem' }}>
                  Save
                </button>
                <button className="btn-secondary" type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {me?.bio && (
                <div className="profile-field">
                  <div className="profile-field-label">About</div>
                  <div className="profile-field-value">{me.bio}</div>
                </div>
              )}
              {(me?.ageRangeMin || me?.ageRangeMax) && (
                <div className="profile-field" style={{ marginTop: '0.75rem' }}>
                  <div className="profile-field-label">Looking for</div>
                  <div className="profile-field-value">Ages {me.ageRangeMin} – {me.ageRangeMax}</div>
                </div>
              )}
              {me?.interests?.length > 0 && (
                <div className="profile-field" style={{ marginTop: '0.75rem' }}>
                  <div className="profile-field-label">Interests</div>
                  <div className="tags-row" style={{ marginTop: '0.35rem' }}>
                    {me.interests.map((t) => <span key={t} className="tag-chip primary">{t}</span>)}
                  </div>
                </div>
              )}
              {me?.favoriteShows?.length > 0 && (
                <div className="profile-field" style={{ marginTop: '0.75rem' }}>
                  <div className="profile-field-label">Favourite Shows</div>
                  <div className="profile-field-value">
                    {me.favoriteShows.join(' · ')}
                  </div>
                </div>
              )}
              {!me?.bio && !me?.interests?.length && (
                <p className="profile-field-empty">Complete your profile to attract more connections.</p>
              )}
            </>
          )}
        </div>

        {/* ── Pending Requests ── */}
        {me?.pendingRequests?.length > 0 && (
          <div className="section-card">
            <div className="section-header">
              <span className="section-title">Friend Requests</span>
              <span className="section-badge">{me.pendingRequests.length} new</span>
            </div>
            <div className="user-list">
              {me.pendingRequests.map((u) => (
                <div key={u._id} className="request-card">
                  <div className="user-avatar" style={{ background: avatarColor(u.email) }}>
                    {initial(u.name, u.email)}
                  </div>
                  <div className="request-info">
                    <div className="request-name">
                      {u.name || u.email.split('@')[0]}{u.age ? `, ${u.age}` : ''}
                    </div>
                    <div className="request-bio">{u.bio || 'No bio yet'}</div>
                  </div>
                  <div className="request-actions">
                    <button className="btn-accept"
                      onClick={() => acceptRequest({ variables: { userId: u._id } })}>
                      Accept
                    </button>
                    <button className="btn-decline"
                      onClick={() => declineRequest({ variables: { userId: u._id } })}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── My Connections ── */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">My Connections</span>
            <span className="section-count">{me?.connections?.length ?? 0} people</span>
          </div>
          <div className="user-list">
            {!me?.connections?.length ? (
              <p className="empty-state">No connections yet — discover people below ↓</p>
            ) : (
              me.connections.map((u) => (
                <div key={u._id} className="user-card">
                  <div className="user-avatar" style={{ background: avatarColor(u.email) }}>
                    {initial(u.name, u.email)}
                  </div>
                  <div className="user-info">
                    <div className="user-name">
                      {u.name || u.email.split('@')[0]}{u.age ? `, ${u.age}` : ''}
                    </div>
                    <div className="user-bio-short">{u.bio || 'No bio yet'}</div>
                  </div>
                  <button className="btn-secondary"
                    onClick={() => removeConn({ variables: { userId: u._id } })}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Discover ── */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">Discover People</span>
            <span className="section-count">{discover.length} available</span>
          </div>
          {discoverLoading ? (
            <p className="empty-state">Looking for people…</p>
          ) : !discover.length ? (
            <p className="empty-state">You've seen everyone — check back soon.</p>
          ) : (
            <div className="discover-grid">
              {discover.map((u) => (
                <div key={u._id} className="discover-card">
                  <div className="discover-card-top">
                    <div className="discover-avatar" style={{ background: avatarColor(u.email) }}>
                      {initial(u.name, u.email)}
                    </div>
                    <div>
                      <div className="discover-name">
                        {u.name || u.email.split('@')[0]}
                      </div>
                      <div className="discover-age">
                        {u.age ? `Age ${u.age}` : 'Age not set'}
                        {u.ageRangeMin && u.ageRangeMax
                          ? ` · Looking for ${u.ageRangeMin}–${u.ageRangeMax}`
                          : ''}
                      </div>
                    </div>
                  </div>

                  {u.bio && <p className="discover-bio">{u.bio}</p>}

                  <div className="discover-meta">
                    {u.interests?.length > 0 && (
                      <div className="discover-meta-row">
                        <span className="discover-meta-icon">🏷</span>
                        <div className="tags-row">
                          {u.interests.slice(0, 4).map((t) => (
                            <span key={t} className="tag-chip">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {u.favoriteShows?.length > 0 && (
                      <div className="discover-meta-row">
                        <span className="discover-meta-icon">📺</span>
                        <span>{u.favoriteShows.slice(0, 3).join(' · ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="discover-card-footer">
                    <button
                      className="btn-primary"
                      style={{ marginTop: 0, padding: '0.65rem', fontSize: '0.875rem' }}
                      onClick={() => sendRequest({ variables: { userId: u._id } })}
                    >
                      Send Request ♥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Date Ideas ── */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">Date Ideas</span>
            <span className="section-count">tap to save</span>
          </div>
          <div className="category-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filter-btn${activeCat === c ? ' active' : ''}`}
                onClick={() => setActiveCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ideas-grid">
            {filteredIdeas.map((idea) => {
              const saved = savedIdeas.includes(idea.id);
              return (
                <div
                  key={idea.id}
                  className={`idea-card${saved ? ' saved' : ''}`}
                  onClick={() => toggleIdea(idea.id)}
                >
                  <div className="idea-emoji">{idea.emoji}</div>
                  <div className="idea-title">{idea.title}</div>
                  <div className="idea-desc">{idea.desc}</div>
                  {saved && <div className="idea-saved-badge">♥ Saved</div>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

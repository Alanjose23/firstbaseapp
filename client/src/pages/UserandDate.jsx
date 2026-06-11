import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_DISCOVER, GET_CONVERSATION } from '../utils/queries';
import {
  UPDATE_PROFILE,
  SEND_REQUEST,
  ACCEPT_REQUEST,
  DECLINE_REQUEST,
  REMOVE_CONNECTION,
  SEND_MESSAGE,
} from '../utils/mutations';
import Auth from '../utils/auth';
import PhotoCarousel from '../components/PhotoCarousel';
import '../styling/UserandDate.css';

/* ── Helpers ─────────────────────────────────────────────── */
const COLORS = ['#8A3033', '#9E4245', '#7D3538', '#B05560', '#6B2326'];
const avatarColor = (str = '') => {
  const n = [...str].reduce((s, c) => s + c.charCodeAt(0), 0);
  return COLORS[n % COLORS.length];
};
const initial = (name, email) =>
  (name?.trim() ? name.trim()[0] : email?.[0] ?? '?').toUpperCase();

const GENDER_OPTIONS = [
  { id: 'man',       label: 'Man',        plural: 'Men' },
  { id: 'woman',     label: 'Woman',      plural: 'Women' },
  { id: 'nonbinary', label: 'Non-binary', plural: 'Non-binary people' },
  { id: 'other',     label: 'Other',      plural: 'Other' },
];
const genderLabel = (id) => GENDER_OPTIONS.find((o) => o.id === id)?.label ?? '';
const genderPlural = (id) => GENDER_OPTIONS.find((o) => o.id === id)?.plural ?? '';

/* First photo when the user has one, coloured-initial circle otherwise */
function Avatar({ user, className }) {
  if (user?.photos?.length) {
    return (
      <img
        className={`${className} avatar-img`}
        src={user.photos[0]}
        alt={user.name || user.email}
      />
    );
  }
  return (
    <div className={className} style={{ background: avatarColor(user?.email) }}>
      {initial(user?.name, user?.email)}
    </div>
  );
}

const TIERS = [
  {
    id: 'free',
    label: 'Free',
    price: 'Free forever',
    comingSoon: false,
    features: ['Unlimited connections', 'Direct messaging', 'Date ideas', 'Invite friends'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: 'Coming Soon',
    comingSoon: true,
    features: [
      'Everything in Free',
      'AI Date Coach — personalised tips',
      'Voice assistant to set up dates',
      'Priority profile visibility',
    ],
  },
];

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
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>×</button>
        </span>
      ))}
      <input
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); add(); }
          if (e.key === ',')     { e.preventDefault(); add(); }
        }}
      />
    </div>
  );
}

/* ── ChatPane sub-component ──────────────────────────────── */
function ChatPane({ me, contact, onClose }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const { data, startPolling, stopPolling } = useQuery(GET_CONVERSATION, {
    variables: { userId: contact._id },
    fetchPolicy: 'network-only',
  });
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const messages = data?.getConversation ?? [];

  useEffect(() => {
    startPolling(3000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText('');
    await sendMessage({ variables: { recipientId: contact._id, content } });
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(Number(ts));
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-pane">
      <div className="chat-pane-header">
        <Avatar user={contact} className="chat-pane-avatar" />
        <span className="chat-pane-name">{contact.name || contact.email.split('@')[0]}</span>
        <button className="chat-pane-close" onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">No messages yet — say hi!</p>
        )}
        {messages.map((msg) => {
          const mine = String(msg.sender._id) === String(me._id);
          return (
            <div key={msg._id} className={`chat-bubble-wrap${mine ? ' mine' : ''}`}>
              <div className={`chat-bubble${mine ? ' chat-bubble--mine' : ' chat-bubble--theirs'}`}>
                {msg.content}
                <span className="chat-time">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${contact.name || 'them'}…`}
          autoFocus
        />
        <button type="submit" className="btn-send" disabled={!text.trim()}>Send</button>
      </form>
    </div>
  );
}

/* ── Date ideas data ─────────────────────────────────────── */
const IDEAS = [
  { id: 1,  emoji: '🌅', title: 'Sunrise Hike',      desc: 'Hit a trail before sunrise. Bring coffee and watch the city wake up.',           cat: 'Couple'      },
  { id: 2,  emoji: '🍕', title: 'Cook Together',      desc: 'Pick a recipe neither of you has made. Tackle it. Fail together.',                cat: 'Couple'      },
  { id: 3,  emoji: '🎨', title: 'Paint Night',        desc: 'Set up canvases at home, open wine, and laugh at the results.',                   cat: 'Couple'      },
  { id: 4,  emoji: '⭐', title: 'Stargazing',         desc: 'Find a dark spot, bring a blanket, and name constellations badly.',               cat: 'Couple'      },
  { id: 5,  emoji: '🌿', title: 'Botanical Garden',   desc: 'Pack a picnic, find a quiet corner, and stay until they kick you out.',           cat: 'Couple'      },
  { id: 6,  emoji: '📚', title: 'Bookshop Wander',    desc: 'Each pick a book for the other. No hints. Swap and read aloud later.',            cat: 'Couple'      },
  { id: 7,  emoji: '🚴', title: 'Bike the City',      desc: 'Rent bikes, no map — just turn wherever looks interesting.',                       cat: 'Couple'      },
  { id: 8,  emoji: '🎬', title: 'Drive-In Movie',     desc: 'Old-school cinema with snacks you smuggled in your hoodie.',                      cat: 'Couple'      },
  { id: 9,  emoji: '🍷', title: 'Wine Tasting',       desc: "Visit a local vineyard or wine bar and pretend to know what you're tasting.",     cat: 'Couple'      },
  { id: 10, emoji: '🌊', title: 'Kayaking',           desc: "Rent a tandem kayak and discover who's actually in charge.",                      cat: 'Couple'      },
  { id: 11, emoji: '🎳', title: 'Bowling Night',      desc: 'Four people, two lanes, one trophy argument. Perfect double date.',               cat: 'Double Date' },
  { id: 12, emoji: '🧩', title: 'Board Game Café',    desc: 'Pick a game none of you have played. Alliances will fracture.',                   cat: 'Double Date' },
  { id: 13, emoji: '🏖️', title: 'Beach Volleyball',  desc: 'Couples vs. couples. The losers buy dinner.',                                      cat: 'Double Date' },
  { id: 14, emoji: '🍻', title: 'Trivia Night',       desc: 'Form a team, destroy strangers, bicker lovingly about wrong answers.',            cat: 'Double Date' },
  { id: 15, emoji: '🎡', title: 'Amusement Park',     desc: 'Roller coasters, funnel cake, and finding out who screams loudest.',              cat: 'Double Date' },
  { id: 16, emoji: '🛶', title: 'Canoe Trip',         desc: 'Pack lunch, rent canoes, race each other down the river.',                        cat: 'Double Date' },
  { id: 17, emoji: '🏌️', title: 'Mini Golf',         desc: 'Perfectly competitive, never takes itself seriously. Ideal.',                     cat: 'Double Date' },
  { id: 18, emoji: '🎵', title: 'Jazz Club Night',    desc: 'Low lights, good drinks, live music. Dress up a little.',                         cat: 'Nightlife'   },
  { id: 19, emoji: '💃', title: 'Salsa Lesson',       desc: "Take a beginners class together. Neither of you will be graceful. That's fine.",  cat: 'Nightlife'   },
  { id: 20, emoji: '🎤', title: 'Karaoke Night',      desc: 'Commit fully to whatever song you pick. This is not a drill.',                    cat: 'Nightlife'   },
  { id: 21, emoji: '🍸', title: 'Cocktail Class',     desc: 'Learn three cocktails from a proper bartender, then make them badly at home.',    cat: 'Nightlife'   },
  { id: 22, emoji: '🎭', title: 'Comedy Club',        desc: 'Laugh so hard you cry. Check the lineup first — trust.',                          cat: 'Nightlife'   },
  { id: 23, emoji: '🎰', title: 'Casino Night',       desc: "Dress up, set a spend limit, and see who's the better poker face.",               cat: 'Nightlife'   },
  { id: 24, emoji: '🏛️', title: 'Museum After Dark', desc: 'Many museums host evening events. Way more atmospheric than daytime.',            cat: 'Nightlife'   },
];

const CATEGORIES = ['All', 'Couple', 'Double Date', 'Nightlife'];

const REFETCH = { refetchQueries: [{ query: QUERY_ME }, { query: QUERY_DISCOVER }] };

/* ── Main component ──────────────────────────────────────── */
export default function NetworkPage() {
  useEffect(() => {
    if (!Auth.loggedIn()) window.location.assign('/login');
  }, []);

  const { data: meData,       loading: meLoading      } = useQuery(QUERY_ME);
  const { data: discoverData, loading: discoverLoading } = useQuery(QUERY_DISCOVER);
  const me      = meData?.me;
  const discover = discoverData?.discoverUsers ?? [];

  // Prompt accounts without a gender to finish onboarding — once per session,
  // so "Skip for now" on the welcome screen doesn't bounce them back.
  useEffect(() => {
    if (me && !me.gender && !sessionStorage.getItem('fb_welcome_prompted')) {
      sessionStorage.setItem('fb_welcome_prompted', '1');
      window.location.assign('/welcome');
    }
  }, [me]);

  /* ── mutations ── */
  const [updateProfile] = useMutation(UPDATE_PROFILE,    { refetchQueries: [{ query: QUERY_ME }] });
  const [sendRequest]   = useMutation(SEND_REQUEST,      REFETCH);
  const [acceptRequest] = useMutation(ACCEPT_REQUEST,    REFETCH);
  const [declineRequest]= useMutation(DECLINE_REQUEST,   REFETCH);
  const [removeConn]    = useMutation(REMOVE_CONNECTION, REFETCH);

  /* ── profile edit state ── */
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});

  const setSocial = (field, value) =>
    setForm((f) => ({ ...f, socialMedia: { ...f.socialMedia, [field]: value } }));

  const openEdit = () => {
    setForm({
      name:          me?.name          ?? '',
      age:           me?.age           ?? '',
      ageRangeMin:   me?.ageRangeMin   ?? 18,
      ageRangeMax:   me?.ageRangeMax   ?? 99,
      bio:           me?.bio           ?? '',
      gender:        me?.gender        ?? '',
      lookingFor:    me?.lookingFor    ?? [],
      photos:        me?.photos        ?? [],
      interests:     me?.interests     ?? [],
      favoriteShows: me?.favoriteShows ?? [],
      socialMedia: {
        instagram: me?.socialMedia?.instagram ?? '',
        twitter:   me?.socialMedia?.twitter   ?? '',
        tiktok:    me?.socialMedia?.tiktok    ?? '',
      },
    });
    setEditing(true);
  };

  /* ── photo upload state ── */
  const [uploading, setUploading]   = useState(false);
  const [photoError, setPhotoError] = useState('');

  const movePhoto = (i, d) =>
    setForm((f) => {
      const arr = [...f.photos];
      [arr[i], arr[i + d]] = [arr[i + d], arr[i]];
      return { ...f, photos: arr };
    });

  const removePhoto = (i) =>
    setForm((f) => ({ ...f, photos: f.photos.filter((_, x) => x !== i) }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await fetch('/api/photos', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      setForm((f) => ({ ...f, photos: [...(f.photos ?? []), data.url] }));
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const vars = {
      ...form,
      age:         form.age ? Number(form.age) : undefined,
      gender:      form.gender || undefined,
      ageRangeMin: Number(form.ageRangeMin),
      ageRangeMax: Number(form.ageRangeMax),
    };
    await updateProfile({ variables: vars });
    setEditing(false);
  };

  /* ── invite link ── */
  const [copied,   setCopied]   = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const inviteLink = `${window.location.origin}/signup?invite=${me?._id ?? ''}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const shareOnTwitter = () => {
    const text = 'Join me on First Base — a new way to meet people. Sign up:';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + inviteLink)}`,
      '_blank'
    );
  };
  const copyForPlatform = (platform) => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setShareMsg(`Link copied — paste it in your ${platform} bio or story!`);
      setTimeout(() => setShareMsg(''), 3000);
    });
  };

  /* ── chat state ── */
  const [chatContact, setChatContact] = useState(null);
  const [showUpgradeFor, setShowUpgradeFor] = useState(null);

  /* ── date ideas state ── */
  const [activeCat, setActiveCat]   = useState('All');
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
            <Avatar user={me} className="profile-avatar-lg" />
            <div className="profile-meta">
              <div className="profile-name">{me?.name || 'Set your name →'}</div>
              <div className="profile-email-sub">{me?.email}</div>
              <div className="profile-stats">
                <span>{me?.connections?.length ?? 0}</span>
                {' connection'}{me?.connections?.length !== 1 ? 's' : ''}
                {me?.age && <>&nbsp;·&nbsp;<span>{me.age}</span> yrs</>}
                {me?.gender && <>&nbsp;·&nbsp;{genderLabel(me.gender)}</>}
                &nbsp;·&nbsp;
                <span className="tier-inline-badge">{(me?.tier ?? 'free').toUpperCase()}</span>
              </div>
            </div>
            {!editing && (
              <button className="btn-secondary" onClick={openEdit}>Edit Profile</button>
            )}
          </div>

          {editing ? (
            <form className="edit-profile-form" onSubmit={handleSave}>
              <div className="field-group">
                <label>Photos ({form.photos?.length ?? 0}/6) — first one is your main photo</label>
                <div className="photo-manager">
                  {form.photos?.map((p, i) => (
                    <div key={p} className="photo-thumb">
                      <img src={p} alt={`Photo ${i + 1}`} />
                      {i === 0 && <span className="photo-thumb-badge">Main</span>}
                      <div className="photo-thumb-actions">
                        <button type="button" disabled={i === 0}
                          aria-label="Move left" onClick={() => movePhoto(i, -1)}>‹</button>
                        <button type="button" disabled={i === form.photos.length - 1}
                          aria-label="Move right" onClick={() => movePhoto(i, 1)}>›</button>
                        <button type="button" aria-label="Remove photo"
                          onClick={() => removePhoto(i)}>✕</button>
                      </div>
                    </div>
                  ))}
                  {(form.photos?.length ?? 0) < 6 && (
                    <label className={`photo-add${uploading ? ' uploading' : ''}`}>
                      {uploading ? '…' : '+'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        disabled={uploading}
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>
                {photoError && <p className="photo-error">{photoError}</p>}
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Full Name</label>
                  <input value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name" />
                </div>
                <div className="field-group">
                  <label>Age</label>
                  <input type="number" min={18} max={100}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g. 28" />
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>I am a…</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {GENDER_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="field-group">
                  <label>Looking for</label>
                  <div className="tags-row" style={{ marginTop: '0.35rem' }}>
                    {GENDER_OPTIONS.map((o) => {
                      const on = form.lookingFor?.includes(o.id);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          className={`tag-chip${on ? ' primary' : ''}`}
                          style={{ cursor: 'pointer', font: 'inherit' }}
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              lookingFor: on
                                ? f.lookingFor.filter((x) => x !== o.id)
                                : [...(f.lookingFor ?? []), o.id],
                            }))
                          }
                        >
                          {o.plural}{on ? ' ✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Looking for (min age)</label>
                  <input type="number" min={18} max={99}
                    value={form.ageRangeMin}
                    onChange={(e) => setForm({ ...form, ageRangeMin: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>Looking for (max age)</label>
                  <input type="number" min={18} max={99}
                    value={form.ageRangeMax}
                    onChange={(e) => setForm({ ...form, ageRangeMax: e.target.value })} />
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

              <div className="field-group">
                <label>Social Media</label>
                <div className="social-inputs">
                  <div className="social-input-row">
                    <span className="social-input-prefix">📸</span>
                    <input placeholder="Instagram handle (no @)"
                      value={form.socialMedia?.instagram ?? ''}
                      onChange={(e) => setSocial('instagram', e.target.value)} />
                  </div>
                  <div className="social-input-row">
                    <span className="social-input-prefix">𝕏</span>
                    <input placeholder="Twitter / X handle (no @)"
                      value={form.socialMedia?.twitter ?? ''}
                      onChange={(e) => setSocial('twitter', e.target.value)} />
                  </div>
                  <div className="social-input-row">
                    <span className="social-input-prefix">🎵</span>
                    <input placeholder="TikTok handle (no @)"
                      value={form.socialMedia?.tiktok ?? ''}
                      onChange={(e) => setSocial('tiktok', e.target.value)} />
                  </div>
                </div>
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
              {me?.photos?.length > 0 && (
                <div className="profile-carousel-wrap">
                  <PhotoCarousel photos={me.photos} alt={me.name || 'My photos'} />
                </div>
              )}
              {me?.bio && (
                <div className="profile-field">
                  <div className="profile-field-label">About</div>
                  <div className="profile-field-value">{me.bio}</div>
                </div>
              )}
              {(me?.ageRangeMin || me?.ageRangeMax) && (
                <div className="profile-field" style={{ marginTop: '0.75rem' }}>
                  <div className="profile-field-label">Looking for</div>
                  <div className="profile-field-value">
                    {me.lookingFor?.length ? `${me.lookingFor.map(genderPlural).join(', ')} · ` : ''}
                    Ages {me.ageRangeMin} – {me.ageRangeMax}
                  </div>
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
                  <div className="profile-field-value">{me.favoriteShows.join(' · ')}</div>
                </div>
              )}
              {(me?.socialMedia?.instagram || me?.socialMedia?.twitter || me?.socialMedia?.tiktok) && (
                <div className="profile-field" style={{ marginTop: '0.75rem' }}>
                  <div className="profile-field-label">Social Media</div>
                  <div className="social-links">
                    {me.socialMedia.instagram && (
                      <a href={`https://instagram.com/${me.socialMedia.instagram}`}
                        target="_blank" rel="noreferrer" className="social-link">
                        📸 @{me.socialMedia.instagram}
                      </a>
                    )}
                    {me.socialMedia.twitter && (
                      <a href={`https://x.com/${me.socialMedia.twitter}`}
                        target="_blank" rel="noreferrer" className="social-link">
                        𝕏 @{me.socialMedia.twitter}
                      </a>
                    )}
                    {me.socialMedia.tiktok && (
                      <a href={`https://tiktok.com/@${me.socialMedia.tiktok}`}
                        target="_blank" rel="noreferrer" className="social-link">
                        🎵 @{me.socialMedia.tiktok}
                      </a>
                    )}
                  </div>
                </div>
              )}
              {!me?.bio && !me?.interests?.length && (
                <p className="profile-field-empty">Complete your profile to attract more connections.</p>
              )}
            </>
          )}
        </div>

        {/* ── Membership Plans ── */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">Membership Plans</span>
            <span className="tier-current-badge">{(me?.tier ?? 'free').toUpperCase()}</span>
          </div>
          <div className="tier-grid">
            {TIERS.map((t) => {
              const isActive = (me?.tier ?? 'free') === t.id;
              return (
                <div key={t.id}
                  className={`tier-card${isActive ? ' tier-active' : ''}${t.comingSoon ? ' tier-locked' : ''}`}>
                  {t.comingSoon && <span className="tier-coming-soon-badge">Coming Soon</span>}
                  <div className="tier-name">{t.label}</div>
                  <div className="tier-price">{t.price}</div>
                  <ul className="tier-features">
                    {t.features.map((f) => (
                      <li key={f}><span className="tier-check">✓</span> {f}</li>
                    ))}
                  </ul>
                  {isActive
                    ? <div className="tier-active-label">Your Current Plan ✓</div>
                    : t.comingSoon
                      ? <button className="btn-tier-cta" disabled>Notify Me</button>
                      : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Pro Features (placeholder UI) ── */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">Pro Features</span>
            <span className="tier-coming-soon-inline">Coming Soon</span>
          </div>

          <div className="pro-features-grid">
            {/* Date Coach */}
            <div className="pro-feature-card">
              <div className="pro-feature-icon">🧑‍🏫</div>
              <div className="pro-feature-title">AI Date Coach</div>
              <div className="pro-feature-desc">
                Get personalised tips based on your profile — conversation starters, venue ideas,
                and real-time coaching to make every date count.
              </div>
              <div className="pro-feature-preview">
                <div className="coach-tip-mock">
                  <span className="coach-tip-label">Today's Tip</span>
                  <p>"Ask about the last trip they took. Travel stories reveal a lot."</p>
                </div>
              </div>
              <button className="btn-pro-unlock"
                onClick={() => setShowUpgradeFor('Date Coach')}>
                Unlock with Pro
              </button>
            </div>

            {/* Voice Assistant */}
            <div className="pro-feature-card">
              <div className="pro-feature-icon">🎙️</div>
              <div className="pro-feature-title">Voice Assistant</div>
              <div className="pro-feature-desc">
                Tell your assistant who you're interested in and let it handle the awkward
                "want to go out?" moment — it'll draft a message, pick a spot, and suggest a time.
              </div>
              <div className="pro-feature-preview">
                <div className="voice-mock">
                  <div className="voice-mic-btn" onClick={() => setShowUpgradeFor('Voice Assistant')}>
                    🎙️
                  </div>
                  <span className="voice-mock-label">Tap to set up a date</span>
                </div>
              </div>
              <button className="btn-pro-unlock"
                onClick={() => setShowUpgradeFor('Voice Assistant')}>
                Unlock with Pro
              </button>
            </div>
          </div>

          {/* Upgrade prompt overlay */}
          {showUpgradeFor && (
            <div className="upgrade-overlay" onClick={() => setShowUpgradeFor(null)}>
              <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
                <div className="upgrade-modal-icon">🔒</div>
                <h3>{showUpgradeFor}</h3>
                <p>This is a <strong>Pro</strong> feature — launching soon!</p>
                <p className="upgrade-modal-sub">
                  We're putting the finishing touches on it. You'll be the first to know.
                </p>
                <button className="btn-primary" style={{ marginTop: 0 }}
                  onClick={() => setShowUpgradeFor(null)}>
                  Got it
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Invite Friends ── */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">Invite Friends</span>
          </div>
          <p className="invite-desc">Share your personal link and grow your network.</p>
          <div className="invite-link-row">
            <span className="invite-link-text">{inviteLink}</span>
            <button className={`btn-copy${copied ? ' btn-copy--done' : ''}`} onClick={copyInviteLink}>
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          <div className="invite-platforms">
            <span className="invite-via-label">Share via</span>
            <button className="btn-platform btn-platform--twitter" onClick={shareOnTwitter}>
              𝕏 Twitter
            </button>
            <button className="btn-platform" onClick={() => copyForPlatform('Instagram')}>
              📸 Instagram
            </button>
            <button className="btn-platform" onClick={() => copyForPlatform('TikTok')}>
              🎵 TikTok
            </button>
          </div>
          {shareMsg && <p className="invite-share-msg">{shareMsg}</p>}
        </div>

        {/* ── Messages ── */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-title">Messages</span>
            <span className="section-count">connections only</span>
          </div>
          {!me?.connections?.length ? (
            <p className="empty-state">Connect with someone to start messaging ↓</p>
          ) : (
            <div className="messages-layout">
              <div className="messages-sidebar">
                {me.connections.map((u) => (
                  <button
                    key={u._id}
                    className={`msg-contact${chatContact?._id === u._id ? ' active' : ''}`}
                    onClick={() => setChatContact(chatContact?._id === u._id ? null : u)}
                  >
                    <Avatar user={u} className="msg-contact-avatar" />
                    <span className="msg-contact-name">
                      {u.name || u.email.split('@')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {chatContact ? (
                <ChatPane me={me} contact={chatContact} onClose={() => setChatContact(null)} />
              ) : (
                <div className="chat-placeholder">
                  <p>Select a connection to start chatting</p>
                </div>
              )}
            </div>
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
                  <Avatar user={u} className="user-avatar" />
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
                  <Avatar user={u} className="user-avatar" />
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
                  {u.photos?.length > 0 && (
                    <PhotoCarousel photos={u.photos} alt={u.name || 'Profile photos'}
                      className="discover-carousel" />
                  )}
                  <div className="discover-card-top">
                    <Avatar user={u} className="discover-avatar" />
                    <div>
                      <div className="discover-name">{u.name || u.email.split('@')[0]}</div>
                      <div className="discover-age">
                        {u.age ? `Age ${u.age}` : 'Age not set'}
                        {u.gender ? ` · ${genderLabel(u.gender)}` : ''}
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

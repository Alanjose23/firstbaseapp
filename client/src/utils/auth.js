class AuthService {
  // The real JWT lives in an httpOnly cookie the server sets.
  // auth_present is a non-httpOnly companion cookie with the same expiry
  // that lets client JS know a session is active without touching the JWT.
  loggedIn() {
    return document.cookie.split(';').some((c) => c.trim().startsWith('auth_present='));
  }

  login() {
    window.location.assign('/');
  }

  async logout() {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
    } finally {
      window.location.assign('/login');
    }
  }
}

export default new AuthService();

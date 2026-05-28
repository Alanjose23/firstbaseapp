import React from 'react';
import '../styling/Home.css';

const Home = () => (
  <div className="hero">
    <div className="hero-content">
      <span className="hero-badge">Dating &amp; Connections</span>
      <h1 className="hero-title">First Base</h1>
      <p className="hero-subtitle">
        Where every great love story begins.
        <br />
        Connect, share, and cherish your moments together.
      </p>
      <div className="hero-divider">♥ ♥ ♥</div>
      <div className="hero-image-wrap">
        <img
          src="https://img.freepik.com/premium-vector/couple-hands-with-love-heart-shape-marry-marriage-affection-wedding-valentine-romantic-logo_358185-399.jpg?w=2000"
          alt="First Base — couple with heart"
        />
      </div>
    </div>
  </div>
);

export default Home;

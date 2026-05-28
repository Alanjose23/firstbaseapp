import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/About.css';

const PILLARS = [
  { icon: '🤝', title: 'Real Connections',  desc: 'We believe the best relationships start with mutual interest. No swiping, no guessing — just people who actually want to meet.' },
  { icon: '💬', title: 'Honest Conversations', desc: 'Direct messaging with your connections keeps things grounded. No anonymous likes — just two people talking.' },
  { icon: '📅', title: 'Date-First Design', desc: 'Every feature — from date ideas to invites — is built around getting you to a real, memorable first date.' },
  { icon: '🔒', title: 'Safety & Trust',   desc: 'Connections are mutual and intentional. You control who you interact with, always.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create your profile',   desc: 'Add your interests, favourite shows, and what you\'re looking for. The more you share, the better your matches.' },
  { step: '02', title: 'Discover people',        desc: 'Browse real profiles of people you haven\'t connected with yet. Send a request when someone catches your eye.' },
  { step: '03', title: 'Connect & message',      desc: 'When someone accepts, you\'re connected. Open a conversation and go from there.' },
  { step: '04', title: 'Plan your first date',   desc: 'Browse our curated date ideas — from sunrise hikes to cocktail classes — and make it happen.' },
];

export default function About() {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <h1 className="about-hero-title">What is First Base?</h1>
          <p className="about-hero-sub">
            First Base is a connection platform built around one idea: the first step matters most.
            We make it easier — and a little less terrifying — to go from "maybe" to "let's grab coffee."
          </p>
          <Link to="/signup" className="btn-about-cta">Get Started</Link>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-label">Our Mission</div>
          <h2 className="about-section-title">Connecting people, not profiles</h2>
          <p className="about-body">
            Too many apps turn dating into a numbers game — endless scrolling, hollow matches,
            and conversations that go nowhere. We built First Base because we believe the best
            relationships start with intention. Every feature we build is designed to get you
            off the app and into a real moment with someone.
          </p>
          <p className="about-body">
            Whether you're looking for a partner, a new friend, or just someone to check out
            that new restaurant with — First Base gives you the tools to make it happen without
            the noise.
          </p>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="about-section about-section--alt">
        <div className="about-section-inner">
          <div className="about-label">What We Stand For</div>
          <h2 className="about-section-title">Built on four beliefs</h2>
          <div className="about-pillars">
            {PILLARS.map((p) => (
              <div key={p.title} className="about-pillar">
                <div className="about-pillar-icon">{p.icon}</div>
                <div className="about-pillar-title">{p.title}</div>
                <p className="about-pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-label">How It Works</div>
          <h2 className="about-section-title">From sign-up to first date</h2>
          <div className="about-steps">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="about-step">
                <div className="about-step-number">{s.step}</div>
                <div>
                  <div className="about-step-title">{s.title}</div>
                  <p className="about-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-section about-section--alt">
        <div className="about-section-inner about-team-inner">
          <div className="about-label">The Team</div>
          <h2 className="about-section-title">Made by two people who believe in first steps</h2>
          <p className="about-body" style={{ textAlign: 'center' }}>
            First Base was created by <strong>David Hall</strong> and <strong>Alan Jose</strong> —
            two developers who got tired of overcomplicated dating apps and decided to build
            something simpler, kinder, and more intentional.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta-section">
        <div className="about-section-inner" style={{ textAlign: 'center' }}>
          <h2 className="about-section-title">Ready to take the first step?</h2>
          <div className="about-cta-buttons">
            <Link to="/signup" className="btn-about-cta">Create an Account</Link>
            <Link to="/login"  className="btn-about-secondary">Sign In</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

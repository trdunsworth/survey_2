import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserSession } from '../utils/sessionManager';
import surveyDataJson from '../../survey_data.json';
import { groupSurveysByCategory, createSectionId } from '../utils/surveyConverter';
import type { SurveyData } from '../types';
import './LandingPage.css';

export const LandingPage = () => {
  const [session, setSession] = useState(getUserSession());
  const surveyData = surveyDataJson as SurveyData;
  const surveySections = groupSurveysByCategory(surveyData);

  useEffect(() => {
    // Ensure session is initialized
    setSession(getUserSession());
  }, []);

  return (
    <main className="landing-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <h1 id="hero-title">Welcome to the NENA 2024 PSAP Survey</h1>
          <p className="hero-subtitle">
            Help shape the future of 9-1-1 services across North America
          </p>
        </div>
      </section>

      <section className="intro" aria-labelledby="intro-title">
        <div className="container">
          <div className="intro-content">
            <h2 id="intro-title">Your Voice Matters</h2>
            <p>
              Thank you for participating in the NENA 2024 PSAP Survey. We know that your time
              is valuable and we appreciate you sharing your data with us. The information you
              share will help NENA better understand staffing and call processing realities
              throughout the industry and support meaningful solutions, advocacy, and future
              planning for the 9-1-1 community.
            </p>
            <p>
              The survey consists of <strong>{surveySections.length} sections</strong> with a
              total of approximately 30-45 minutes to complete. Your participation makes a
              difference.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                🔒
              </div>
              <h3>Completely Anonymous</h3>
              <p>
                No login required. No personal information collected. Your responses are stored
                locally on your device.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                📋
              </div>
              <h3>Complete at Your Own Pace</h3>
              <p>
                You can complete surveys in any order and return to finish them later. Your
                progress is automatically saved.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                🔗
              </div>
              <h3>Linked Results</h3>
              <p>
                All your survey responses are automatically linked together using a unique
                session ID.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                ♿
              </div>
              <h3>Accessible Design</h3>
              <p>
                Built to WCAG 2.1 AA standards with keyboard navigation, screen reader support,
                and high contrast modes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="available-surveys" aria-labelledby="surveys-title">
        <div className="container">
          <h2 id="surveys-title">Available Survey Sections</h2>
          <p className="section-intro">
            The survey is divided into thematic sections. You can complete them in any order.
          </p>
          <div className="survey-list">
            {surveySections.map((section, index) => (
              <div key={index} className="survey-card">
                <h3>{section.title}</h3>
                <p className="question-count">{section.questions.length} questions</p>
                <Link
                  to={`/survey/${createSectionId(section.title)}`}
                  className="button"
                  aria-label={`Start ${section.title} survey section`}
                >
                  Start Section
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Begin?</h2>
          <p>Your session ID: <code className="session-id">{session.userId}</code></p>
          <p className="session-note">
            Save this ID if you need to reference your responses later.
          </p>
          <Link to="/surveys" className="button button-large">
            View All Surveys
          </Link>
        </div>
      </section>
    </main>
  );
};

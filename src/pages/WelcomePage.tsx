import { Link } from 'react-router-dom';
import './WelcomePage.css';

export const WelcomePage = () => {
  return (
    <main className="welcome-page">
      <div className="container">
        <div className="welcome-content">
          <h1>NENA 2024 PSAP Survey</h1>
          
          <div className="welcome-message">
            <p>
              Thank you for participating in the NENA 2024 PSAP Survey. We know that your time 
              is valuable and we appreciate you sharing your data with us. The information you 
              share will help NENA better understand staffing and call processing realities 
              throughout the industry and support meaningful solutions, advocacy, and future 
              planning for the 9-1-1 community.
            </p>
            
            <p>
              The survey will take approximately <strong>30-45 minutes</strong> and consists of 
              multiple sections. Your voice matters, and your participation makes a difference.
            </p>
          </div>

          <div className="survey-info">
            <h2>Before You Begin</h2>
            <ul>
              <li>All responses are anonymous and confidential</li>
              <li>Your progress is automatically saved</li>
              <li>You can complete sections in any order</li>
              <li>You can pause and return at any time</li>
            </ul>
          </div>

          <div className="action-buttons">
            <Link to="/surveys" className="button button-primary">
              Begin Survey
            </Link>
            <Link to="/" className="button button-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

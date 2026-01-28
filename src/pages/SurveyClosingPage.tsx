import { Link } from 'react-router-dom';
import './SurveyClosingPage.css';

export const SurveyClosingPage = () => {
  return (
    <main className="survey-closing-page">
      <div className="container">
        <div className="closing-content">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>
          
          <h1>Survey Complete</h1>
          
          <div className="closing-message">
            <p>
              Thank you for completing the NENA 2024 PSAP Survey. Your participation is greatly 
              appreciated and will help NENA better understand staffing and call processing 
              standards. Your feedback is valuable throughout the industry and supports 
              meaningful solutions, advocacy, and future planning for the 9-1-1 community.
            </p>
          </div>

          <div className="next-steps">
            <h2>What Happens Next?</h2>
            <p>
              Your responses have been saved and will contribute to important research and 
              advocacy efforts for the 9-1-1 community. NENA will analyze the aggregated data 
              to identify trends, challenges, and opportunities for improvement in PSAP operations 
              nationwide.
            </p>
          </div>

          <div className="data-reminder">
            <h3>Important: Save Your Data</h3>
            <p>
              Your responses are stored locally on your device. We recommend exporting your data 
              for your records before leaving this page.
            </p>
          </div>

          <div className="action-buttons">
            <Link to="/progress" className="button button-primary">
              View & Export Responses
            </Link>
            <Link to="/" className="button button-secondary">
              Return to Home
            </Link>
          </div>

          <div className="thank-you-note">
            <p>
              <strong>On behalf of NENA and the entire 9-1-1 community, thank you for your 
              valuable contribution!</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

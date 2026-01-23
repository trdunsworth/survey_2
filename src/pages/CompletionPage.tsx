import { Link } from 'react-router-dom';
import './CompletionPage.css';

export const CompletionPage = () => {
  return (
    <main className="completion-page">
      <div className="container">
        <div className="completion-content">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>
          <h1>Thank You for Completing This Survey Section!</h1>
          <p className="completion-message">
            Thank you for completing this section of the NENA 2024 PSAP Survey. Your
            participation is greatly appreciated and will help NENA better understand staffing
            and call processing standards throughout the industry.
          </p>
          <p className="completion-message">
            Your feedback supports meaningful solutions, advocacy, and future planning for the
            9-1-1 community.
          </p>

          <div className="next-steps">
            <h2>What&apos;s Next?</h2>
            <div className="steps-grid">
              <div className="step-card">
                <h3>Continue with Another Section</h3>
                <p>Complete additional survey sections to provide more comprehensive data.</p>
                <Link to="/surveys" className="button">
                  View All Surveys
                </Link>
              </div>

              <div className="step-card">
                <h3>Review Your Progress</h3>
                <p>See which sections you&apos;ve completed and export your responses.</p>
                <Link to="/progress" className="button button-secondary">
                  View Progress
                </Link>
              </div>

              <div className="step-card">
                <h3>Return to Home</h3>
                <p>Go back to the landing page to learn more about the survey.</p>
                <Link to="/" className="button button-secondary">
                  Go Home
                </Link>
              </div>
            </div>
          </div>

          <div className="reminder-box">
            <h3>Important Reminder</h3>
            <p>
              Your responses are saved locally on your device. If you clear your browser data,
              your responses will be lost. Make sure to export your data from the Progress page
              if you want to keep a permanent record.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getUserSession,
  getSurveyResults,
  exportUserResults,
  clearUserData,
} from '../utils/sessionManager';
import surveyDataJson from '../../survey_data.json';
import { groupSurveysByCategory, createSectionId } from '../utils/surveyConverter';
import type { SurveyData } from '../types';
import './ProgressPage.css';

export const ProgressPage = () => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const session = getUserSession();
  const results = getSurveyResults();
  const surveyData = surveyDataJson as SurveyData;
  const sections = groupSurveysByCategory(surveyData);

  const handleExport = () => {
    const exportData = exportUserResults();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nena-survey-${session.userId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    clearUserData();
    window.location.reload();
  };

  const completedCount = session.completedSurveys.length;
  const totalSections = sections.length;
  const completionPercentage = Math.round((completedCount / totalSections) * 100);

  return (
    <main className="progress-page">
      <div className="container">
        <header className="page-header">
          <h1>My Progress</h1>
          <p className="page-description">
            Track your survey completion progress and export your responses.
          </p>
        </header>

        <div className="progress-summary">
          <div className="summary-card">
            <h2>Session Information</h2>
            <div className="info-row">
              <span className="label">Session ID:</span>
              <code className="value">{session.userId}</code>
            </div>
            <div className="info-row">
              <span className="label">Started:</span>
              <span className="value">{new Date(session.createdAt).toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Sections Completed:</span>
              <span className="value">
                {completedCount} of {totalSections} ({completionPercentage}%)
              </span>
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: `${completionPercentage}%` }}
            >
              <span className="progress-text">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="sections-status">
          <h2>Survey Sections Status</h2>
          <div className="sections-grid">
            {sections.map((section, index) => {
              const sectionId = createSectionId(section.title);
              const isComplete = session.completedSurveys.includes(sectionId);
              const sectionResult = results.find((r) => r.surveyId === sectionId);

              return (
                <div key={index} className={`section-status ${isComplete ? 'complete' : 'incomplete'}`}>
                  <div className="section-header">
                    <h3>{section.title}</h3>
                    <span className={`status-badge ${isComplete ? 'complete' : 'incomplete'}`}>
                      {isComplete ? '✓ Complete' : 'Incomplete'}
                    </span>
                  </div>
                  {sectionResult && (
                    <div className="section-meta">
                      <small>
                        Completed: {new Date(sectionResult.completionTime).toLocaleString()}
                      </small>
                    </div>
                  )}
                  <Link
                    to={`/survey/${sectionId}`}
                    className="button button-small"
                  >
                    {isComplete ? 'Review' : 'Start'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="actions-section">
          <h2>Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>Export Responses</h3>
              <p>
                Download your survey responses as a JSON file. This file can be imported into a
                database or shared with administrators.
              </p>
              <button onClick={handleExport} className="button" disabled={results.length === 0}>
                Download JSON
              </button>
            </div>

            <div className="action-card warning">
              <h3>Clear All Data</h3>
              <p>
                Delete all your survey responses and start fresh. This action cannot be undone.
                Make sure to export your data first!
              </p>
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="button button-secondary"
                >
                  Clear Data
                </button>
              ) : (
                <div className="confirm-actions">
                  <p className="warning-text">Are you sure? This cannot be undone!</p>
                  <button onClick={handleClearData} className="button" style={{ backgroundColor: 'var(--color-error)' }}>
                    Yes, Clear Everything
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="button button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="page-actions">
          <Link to="/surveys" className="button">
            Continue Surveys
          </Link>
          <Link to="/" className="button button-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

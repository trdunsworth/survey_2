import { Link } from 'react-router-dom';
import surveyDataJson from '../../survey_data.json';
import { groupSurveysByCategory, createSectionId } from '../utils/surveyConverter';
import { isSurveyComplete } from '../utils/sessionManager';
import type { SurveyData } from '../types';
import './SurveysListPage.css';

export const SurveysListPage = () => {
  const surveyData = surveyDataJson as SurveyData;
  const sections = groupSurveysByCategory(surveyData);

  return (
    <main className="surveys-list-page">
      <div className="container">
        <header className="page-header">
          <h1>Available Survey Sections</h1>
          <p className="page-description">
            The NENA PSAP Survey is divided into {sections.length} thematic sections. You can
            complete them in any order and return to finish them later. Your progress is
            automatically saved.
          </p>
        </header>

        <div className="surveys-grid">
          {sections.map((section, index) => {
            const sectionId = createSectionId(section.title);
            const isComplete = isSurveyComplete(sectionId);

            return (
              <article key={index} className="survey-card-large">
                <div className="survey-header">
                  <h2>{section.title}</h2>
                  {isComplete && (
                    <span className="completion-badge" aria-label="Completed">
                      ✓ Complete
                    </span>
                  )}
                </div>

                <div className="survey-meta">
                  <span className="question-count">
                    {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                  </span>
                  <span className="time-estimate">~5-10 minutes</span>
                </div>

                <div className="survey-actions">
                  <Link
                    to={`/survey/${sectionId}`}
                    className="button"
                    aria-label={`${isComplete ? 'Review' : 'Start'} ${section.title} survey`}
                  >
                    {isComplete ? 'Review Responses' : 'Start Section'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="page-actions">
          <Link to="/progress" className="button button-secondary">
            View My Progress
          </Link>
          <Link to="/glossary" className="button button-secondary">
            View Glossary
          </Link>
        </div>
      </div>
    </main>
  );
};

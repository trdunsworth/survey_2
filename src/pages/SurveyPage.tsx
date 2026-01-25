import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import surveyDataJson from '../../survey_data.json';
import {
  convertToSurveyJS,
  groupSurveysByCategory,
  createSectionId,
} from '../utils/surveyConverter';
import {
  getUserSession,
  saveSurveyResults,
  markSurveyComplete,
  getSurveyProgress,
} from '../utils/sessionManager';
import type { SurveyData } from '../types';
import './SurveyPage.css';

export const SurveyPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [surveyModel, setSurveyModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const surveyData = surveyDataJson as SurveyData;

  // Memoize sections to prevent infinite loop
  const sections = useMemo(() => groupSurveysByCategory(surveyData), [surveyData]);

  useEffect(() => {
    if (!sectionId) {
      setIsLoading(false);
      return;
    }

    // Find the matching section
    const section = sections.find((s) => createSectionId(s.title) === sectionId);

    if (!section) {
      setIsLoading(false);
      return;
    }

    // Convert to SurveyJS format
    const sectionIndex = sections.indexOf(section);
    const surveyJson = convertToSurveyJS(section, sectionIndex);

    // Debug: Log the survey JSON to console
    console.log('Survey JSON:', JSON.stringify(surveyJson, null, 2));

    // Create model
    const model = new Model(surveyJson);

    // Apply NENA theme
    model.applyTheme({
      colorPalette: 'light',
      isPanelless: false,
      cssVariables: {
        '--primary': '#cc0000',
        '--primary-light': '#ff3333',
        '--background': '#ffffff',
        '--background-dim': '#f5f5f5',
        '--foreground': '#1a1a1a',
        '--base-unit': '8px',
      },
    });

    // Load saved progress
    const savedProgress = getSurveyProgress(sectionId);
    if (savedProgress && savedProgress.responses) {
      model.data = savedProgress.responses as Record<string, unknown>;
    }

    // Handle completion
    model.onComplete.add((sender) => {
      const session = getUserSession();
      const result = {
        userId: session.userId,
        surveyId: sectionId,
        surveyTitle: section.title,
        startTime: savedProgress?.startTime || new Date().toISOString(),
        completionTime: new Date().toISOString(),
        responses: sender.data,
        percentComplete: 100,
      };

      saveSurveyResults(result);
      markSurveyComplete(sectionId);
      navigate('/complete');
    });

    // Auto-save on value change
    model.onValueChanged.add((sender) => {
      const session = getUserSession();
      const result = {
        userId: session.userId,
        surveyId: sectionId,
        surveyTitle: section.title,
        startTime: savedProgress?.startTime || new Date().toISOString(),
        completionTime: new Date().toISOString(),
        responses: sender.data,
        percentComplete: sender.getProgress(),
      };

      saveSurveyResults(result);
    });

    setSurveyModel(model);
    setIsLoading(false);
  }, [sectionId, navigate, sections]);

  if (isLoading) {
    return (
      <main className="survey-page">
        <div className="container">
          <div className="loading" aria-live="polite" aria-busy="true">
            Loading survey...
          </div>
        </div>
      </main>
    );
  }

  if (!sectionId) {
    return (
      <main className="survey-page">
        <div className="container">
          <div className="error-message" role="alert">
            <h2>Survey Not Found</h2>
            <p>Please select a survey from the list.</p>
            <button onClick={() => navigate('/surveys')}>View Surveys</button>
          </div>
        </div>
      </main>
    );
  }

  const section = sections.find((s) => createSectionId(s.title) === sectionId);

  if (!section) {
    return (
      <main className="survey-page">
        <div className="container">
          <div className="error-message" role="alert">
            <h2>Survey Section Not Found</h2>
            <p>The requested survey section could not be found.</p>
            <button onClick={() => navigate('/surveys')}>View All Surveys</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="survey-page">
      <div className="container">
        <div className="survey-header">
          <h1>{section.title}</h1>
          <p className="survey-description">
            Complete this section at your own pace. Your progress is automatically saved.
          </p>
        </div>

        <div className="survey-container">
          {surveyModel && <Survey model={surveyModel} />}
        </div>

        <div className="survey-actions">
          <button onClick={() => navigate('/surveys')} className="button button-secondary">
            Back to Surveys
          </button>
        </div>
      </div>
    </main>
  );
};

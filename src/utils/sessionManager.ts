import { v4 as uuidv4 } from 'uuid';
import type { UserSession, SurveyResult } from '../types';

const USER_SESSION_KEY = 'nena_user_session';
const SURVEY_RESULTS_KEY = 'nena_survey_results';

/**
 * Get or create a user session
 * This allows users to complete surveys without logging in
 * while still linking their responses together
 */
export const getUserSession = (): UserSession => {
  const storedSession = localStorage.getItem(USER_SESSION_KEY);

  if (storedSession) {
    try {
      return JSON.parse(storedSession) as UserSession;
    } catch (error) {
      console.error('Error parsing user session:', error);
    }
  }

  // Create new session
  const newSession: UserSession = {
    userId: uuidv4(),
    createdAt: new Date().toISOString(),
    completedSurveys: [],
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

/**
 * Update user session with completed survey
 */
export const markSurveyComplete = (surveyId: string): void => {
  const session = getUserSession();

  if (!session.completedSurveys.includes(surveyId)) {
    session.completedSurveys.push(surveyId);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  }
};

/**
 * Check if a survey has been completed
 */
export const isSurveyComplete = (surveyId: string): boolean => {
  const session = getUserSession();
  return session.completedSurveys.includes(surveyId);
};

/**
 * Save survey results
 */
export const saveSurveyResults = (result: SurveyResult): void => {
  const results = getSurveyResults();
  results.push(result);
  localStorage.setItem(SURVEY_RESULTS_KEY, JSON.stringify(results));
};

/**
 * Get all survey results for the current user
 */
export const getSurveyResults = (): SurveyResult[] => {
  const storedResults = localStorage.getItem(SURVEY_RESULTS_KEY);
  const session = getUserSession();

  if (storedResults) {
    try {
      const allResults = JSON.parse(storedResults) as SurveyResult[];
      // Filter to only this user's results
      return allResults.filter((result) => result.userId === session.userId);
    } catch (error) {
      console.error('Error parsing survey results:', error);
    }
  }

  return [];
};

/**
 * Export all results for current user (for database import)
 */
export const exportUserResults = (): string => {
  const session = getUserSession();
  const results = getSurveyResults();

  const exportData = {
    userId: session.userId,
    sessionCreated: session.createdAt,
    surveys: results,
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Get survey progress
 */
export const getSurveyProgress = (surveyId: string): SurveyResult | null => {
  const results = getSurveyResults();
  return results.find((r) => r.surveyId === surveyId) || null;
};

/**
 * Clear all user data (for testing)
 */
export const clearUserData = (): void => {
  localStorage.removeItem(USER_SESSION_KEY);
  localStorage.removeItem(SURVEY_RESULTS_KEY);
};

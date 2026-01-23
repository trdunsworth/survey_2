import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SurveysListPage } from './pages/SurveysListPage';
import { SurveyPage } from './pages/SurveyPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { CompletionPage } from './pages/CompletionPage';
import { ProgressPage } from './pages/ProgressPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <div id="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/surveys" element={<SurveysListPage />} />
            <Route path="/survey/:sectionId" element={<SurveyPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/complete" element={<CompletionPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

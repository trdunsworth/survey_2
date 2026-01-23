import { Link } from 'react-router-dom';
import glossaryDataJson from '../../glossary_data.json';
import type { GlossaryTerm } from '../types';
import './GlossaryPage.css';

export const GlossaryPage = () => {
  const glossary = (glossaryDataJson as GlossaryTerm[]).sort((a, b) =>
    a.term.localeCompare(b.term)
  );

  return (
    <main className="glossary-page">
      <div className="container">
        <header className="page-header">
          <h1>Glossary of Terms</h1>
          <p className="page-description">
            Definitions of common terms used throughout the NENA PSAP Survey. Hover over
            underlined terms in the survey to see their definitions.
          </p>
        </header>

        <div className="glossary-grid">
          {glossary.map((item, index) => (
            <article key={index} className="glossary-item" id={`term-${index}`}>
              <dt className="glossary-term">
                <h2>{item.term}</h2>
              </dt>
              <dd className="glossary-definition">{item.definition}</dd>
            </article>
          ))}
        </div>

        <div className="glossary-actions">
          <Link to="/surveys" className="button">
            Back to Surveys
          </Link>
        </div>
      </div>
    </main>
  );
};

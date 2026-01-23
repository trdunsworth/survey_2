import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <header className="site-header" role="banner">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" aria-label="NENA Survey Home">
              <h1>
                <span className="logo-nena">NENA</span>
                <span className="logo-subtitle">PSAP Survey</span>
              </h1>
            </Link>
          </div>
          <nav className="main-nav" role="navigation" aria-label="Main navigation">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/surveys">Surveys</Link>
              </li>
              <li>
                <Link to="/glossary">Glossary</Link>
              </li>
              <li>
                <Link to="/progress">My Progress</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

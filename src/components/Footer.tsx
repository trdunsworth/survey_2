import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About NENA</h3>
            <p>
              The National Emergency Number Association (NENA) is a non-profit organization
              dedicated to advancing 9-1-1 as the universal emergency number.
            </p>
            <a
              href="https://www.nena.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Visit NENA.org
            </a>
          </div>

          <div className="footer-section">
            <h3>Privacy</h3>
            <p>
              This survey is completely anonymous. No personally identifiable information is
              collected. Results are stored locally on your device until you choose to submit
              them.
            </p>
          </div>

          <div className="footer-section">
            <h3>Accessibility</h3>
            <p>
              This site is designed to meet WCAG 2.1 AA standards. If you encounter any
              accessibility issues, please contact us.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} NENA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

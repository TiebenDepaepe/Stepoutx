import { useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'plottwist-cookie-notice';

function isDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'gezien';
  } catch {
    return false;
  }
}

// Informational notice only: the site sets no tracking or marketing cookies,
// so there is nothing to consent to. If those are ever added, this must become
// a real consent banner (accept + reject, scripts blocked until accepted).
export default function CookieNotice() {
  const [visible, setVisible] = useState(() => !isDismissed());

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'gezien');
    } catch {
      // Storage unavailable (private mode): just hide for this visit.
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookiemelding"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-xl mx-auto sm:mr-6 sm:ml-auto bg-white border-2 border-charcoal rounded-2xl shadow-[4px_4px_0px_0px_rgba(29,29,29,1)] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-charcoal/80 leading-relaxed">
          Deze website gebruikt geen tracking- of marketingcookies. We bewaren
          enkel wat nodig is om de site te laten werken.{' '}
          <Link to="/cookiebeleid" className="underline hover:text-charcoal">
            Meer info
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 inline-flex items-center justify-center px-5 py-2 bg-charcoal text-white font-medium rounded-xl border-2 border-charcoal hover:bg-white hover:text-charcoal transition-colors"
        >
          Oké
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';

export default function Modal({ open, title, children, onClose, footer = null, className = '' }) {
  const [shouldRender, setShouldRender] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setClosing(false);
      return;
    }

    if (shouldRender) {
      setClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setClosing(false);
      }, 180);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [open, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`mdm-modalRoot ${closing ? 'is-closing' : 'is-open'}`.trim()} role="presentation">
      <div className="mdm-modalOverlay" />
      <div className={`mdm-modal ${className}`.trim()} role="dialog" aria-modal="true" aria-labelledby="mdm-modal-title">
        <div className="mdm-modal__header">
          <div>
            <p className="mdm-modal__eyebrow">Master Data</p>
            <h2 id="mdm-modal-title" className="mdm-modal__title">
              {title}
            </h2>
          </div>
          <button className="mdm-button mdm-button--ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mdm-modal__body">{children}</div>
        {footer ? <div className="mdm-modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
}

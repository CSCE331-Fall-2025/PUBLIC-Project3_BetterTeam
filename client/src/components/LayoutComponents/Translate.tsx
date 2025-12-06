
import { useEffect } from "react";

import "./Translate.css";

// Add to TS type system... needed so TS compiler doesn't error...
declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export function GoogleTranslate() {
  useEffect(() => {

    // Google Translate CDN looks explicity for this object, thus create it so it can find it
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // initial language
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        // the actual div that widget will appear in --> the returned html component
        "google_translate_element"
      );
    };

    // Check if the script is already added (avoid adding twice)
    const existingScript = document.querySelector(
      'script[src*="translate_a/element.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Aforementioned div that the widget lives in
  return <div id="google_translate_element"></div>;
}


"use client";

/**
 * Inline script that runs before paint to apply theme from localStorage.
 * Avoids flash of wrong theme.
 */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var t;try{t=localStorage.getItem('ap-theme');}catch(e){t=null;}var theme=(t==='light'||t==='dark')?t:'dark';document.documentElement.classList.toggle('dark',theme==='dark');})();`,
      }}
    />
  );
}

import { useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  function toggle() {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  }
  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700"
    >
      {dark ? 'Light' : 'Dark'} Mode
    </button>
  );
}

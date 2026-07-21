// Settings page initialization
export default function initSettings() {
  const lightThemeBtn = document.getElementById('light-theme');
  const darkThemeBtn = document.getElementById('dark-theme');

  // Set a default theme on the front-end
  const defaultTheme = 'light';
  document.body.classList.toggle('dark-theme', defaultTheme === 'dark');
  lightThemeBtn.classList.add('active');
  darkThemeBtn.classList.remove('active');

  // Add event listeners
  lightThemeBtn.addEventListener('click', () => updateTheme('light'));
  darkThemeBtn.addEventListener('click', () => updateTheme('dark'));
}

function updateTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');

  // Update button states
  const lightThemeBtn = document.getElementById('light-theme');
  const darkThemeBtn = document.getElementById('dark-theme');

  if (theme === 'dark') {
    darkThemeBtn.classList.add('active');
    lightThemeBtn.classList.remove('active');
  } else {
    lightThemeBtn.classList.add('active');
    darkThemeBtn.classList.remove('active');
  }
}
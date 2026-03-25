/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // slate-900
        surface: '#1E293B',    // slate-800
        primary: '#3B82F6',    // blue-500
        secondary: '#64748B',  // slate-500
        danger: '#EF4444',     // red-500
        success: '#10B981',    // emerald-500
      }
    },
  },
  plugins: [],
}

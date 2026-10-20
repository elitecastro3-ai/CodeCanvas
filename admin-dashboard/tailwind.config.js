/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Same palette as the public CodeCanvas website
        ink: { 1000: '#060b18', 950: '#0a1122', 900: '#0f172a', 850: '#131d33', 800: '#18233d', 700: '#243252' },
        brand: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
        gold: { DEFAULT: '#e3ab3d', deep: '#a16f0c' },
        muted: '#9fb0c8',
        soft: '#cbd5e1',
        line: 'rgba(148,163,184,0.18)',
        'line-strong': 'rgba(148,163,184,0.32)',
      },
    },
  },
  plugins: [],
}

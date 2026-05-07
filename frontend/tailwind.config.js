/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0d6efd',
                    dark: '#0b5ed7',
                    light: '#e3f0ff',
                },
                orange: {
                    DEFAULT: '#ff6b00',
                    light: '#fff3eb',
                },
                teal: {
                    DEFAULT: '#00cec9',
                    light: '#e0f7f6',
                },
                gray: {
                    900: '#1c1c1c',
                    800: '#505050',
                    700: '#8b96a5',
                    600: '#a9acb0',
                    500: '#bdc4cd',
                    400: '#dee2e7',
                    300: '#e0e0e0',
                    200: '#eff2f4',
                    100: '#f7fafc',
                },
                success: '#00b517',
                warning: '#ff9017',
                danger: '#fa3434',
                border: '#dee2e7',
                background: '#ffffff',
                'background-secondary': '#f7fafc',
                'text-primary': '#1c1c1c',
                'text-secondary': '#505050',
                'text-muted': '#8b96a5',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

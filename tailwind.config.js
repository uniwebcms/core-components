module.exports = {
    content: ['./src/**/*.{js,jsx}'],
    plugins: [require('@uniwebcms/uniweb-tailwind-plugin'), require('@tailwindcss/typography')],
    theme: {
        extend: {
            // You can add theme extensions here
            colors: {},
            spacing: {
                '8xl': '96rem',
                '9xl': '108rem'
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: 'inherit',
                        a: {
                            textDecoration: 'underline'
                        }
                    }
                }
            })
            // Adding custom color themes for the typography "prose" class
            // @see: https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#adding-custom-color-themes
            // Customizing the CSS for "prose"
            // @see https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#customizing-the-css
        }
    }
};

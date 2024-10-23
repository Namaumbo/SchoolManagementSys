/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";

module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.ts",
        "./resources/**/*.tsx",
        "./resources/**/*.vue",
        flowbite.content(),
    ],
    theme: {
        extend: {},
    },
    plugins: [flowbite.plugin()],
};

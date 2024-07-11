import { js } from 'laravel-mix';

js('resources/js/app.js', 'public/js')
   .react()
   .postCss('resources/css/app.css', 'public/css', [
      require('tailwindcss'),
   ]);

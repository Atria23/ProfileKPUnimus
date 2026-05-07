// import './bootstrap';
// import '../css/app.css';

// import { createRoot } from 'react-dom/client';
// import { createInertiaApp } from '@inertiajs/react';
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// createInertiaApp({
//     title: (title) => `${title} - ${appName}`,
//     resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
//     setup({ el, App, props }) {
//         const root = createRoot(el);
//         root.render(<App {...props} />);
//     },
//     progress: {
//         color: '#4B5563',
//     },
// });
// File: resources/js/app.jsx

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// --- 1. IMPORT SEMUA YANG DIPERLUKAN ---
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// --- 2. KONFIGURASI DAYJS UNTUK WIB ---
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Jakarta'); // <-- KUNCI UTAMA: Set default ke WIB

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // --- 3. BUNGKUS APLIKASI DENGAN PROVIDER ---
        root.render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <App {...props} />
            </LocalizationProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
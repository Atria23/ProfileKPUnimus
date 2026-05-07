import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
// 'tailwindcss' sudah termasuk dalam laravel-vite-plugin, jadi Anda mungkin tidak perlu ini
import react from '@vitejs/plugin-react';

export default defineConfig({
    // Tambahkan bagian 'server' ini
    // yang server di bawah sesuaikan dengan ip host ipv4 dari wifi yang dipakai serta menjalankan "php artisan serve --host=0.0.0.0 --port=8000" agar bisa dibuka dari hp maupun laptop (kalo yang port itu bebas, tapi kalo host itu dibuat gitu)
    // cara buka nya di semua komputer yaitu dengan mengakses http://localhost:8000/
    server: {
        host: '0.0.0.0',
        port: 5174,
        hmr: {
            host: '10.230.151.48',
        },
        cors: true
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});

import React from 'react';
import Navbar from '@/Components/Navbar'; // Asumsi alias @ menunjuk ke resources/js
import Footer from '@/Components/Footer';

export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            
            <main className="flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    );
}
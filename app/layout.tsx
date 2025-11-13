import '@aws-amplify/ui-react/styles.css';
import './globals.css';
import {Metadata} from "next";
import React from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: 'Expedientes',
    description: 'Parte 3 - Expedientes con Auth (Amplify + Next.js)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                {children}
                <Toaster position="top-right" richColors closeButton />
            </body>
        </html>
    );
}
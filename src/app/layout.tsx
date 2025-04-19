'use client'
import './global.css';
import TopMenu from '@/components/TopMenu';
import { Agbalumo } from "next/font/google";
import './global.css';
import { useEffect, useState } from 'react';
import { getAuthCookie } from '@/libs/getAuthCookie';
const agbalumo = Agbalumo({
    weight: '400',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
        async function fetchToken() {
            try {
                const data = await getAuthCookie();
                if (data.success) {
                    setToken(data.token);
                    setRole(data.role || null);
                } else {
                    setToken(null);
                    setRole(null);
                }
            } catch (err) {
                console.error("Error fetching auth cookie", err);
                setToken(null);
                setRole(null);
            }
        }
        fetchToken();
    }, [token]);
    return (
        <html>
            <body className={agbalumo.className}>
                <TopMenu token={token} role={role} />
                <main className="pt-[60px] w-[100vw] h-[100vh]">{children}</main>
            </body>
        </html>
    );
}

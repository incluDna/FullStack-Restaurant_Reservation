import './global.css';

import TopMenu from '@/components/TopMenu';
import ReduxProvider from '@/redux/ReduxProvider';
import { Agbalumo } from "next/font/google";
import { NoticeProvider } from "@/components/NoticeContext";

import './global.css';
import NotificationCard from '@/components/NotificationCard';
import TestButton from '@/components/testButton';

const agbalumo = Agbalumo({
    weight: '400',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body className={agbalumo.className}>
                <ReduxProvider>
                    <NoticeProvider>
                        <TopMenu />
                        {/* <TestButton/> */}
                        <NotificationCard />
                        <main className="pt-[60px] w-[100vw] h-[100vh]">{children}</main>
                    </NoticeProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}

import './global.css';

import TopMenu from '@/components/TopMenu';
import ReduxProvider from '@/redux/ReduxProvider';
import { Agbalumo } from "next/font/google";
import './global.css';
import NotificationCard from '@/components/NotificationCard';

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
                    <TopMenu/>
                    <NotificationCard/>
                    <main className="pt-[60px] w-[100vw] h-[100vh]">{children}</main>
                </ReduxProvider>
            </body>
        </html>
  );
}

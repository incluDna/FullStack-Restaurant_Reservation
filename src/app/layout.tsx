import './global.css';

import TopMenu from '@/components/TopMenu';
import { Agbalumo } from "next/font/google";
import './global.css';
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
                <TopMenu/>
                <main className="pt-[60px] w-[100vw] h-[100vh]">{children}</main>
            </body>
        </html>
  );
}

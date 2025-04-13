import './global.css';

export const metadata = {
  title: 'Login',
  description: 'Tailwind login page',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

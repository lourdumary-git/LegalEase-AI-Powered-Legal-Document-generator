import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LegalEase - AI Legal Document Generator',
  description: 'Generate customized legal agreements and documents powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
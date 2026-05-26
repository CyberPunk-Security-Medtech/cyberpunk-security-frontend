import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@context/AuthContext';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";


const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
});

export const metadata: Metadata = {
  title: 'PrivaCure',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
          <ToastContainer position="top-right" theme="colored" />
              <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

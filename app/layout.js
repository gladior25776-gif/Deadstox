import { Bodoni_Moda, Syne } from 'next/font/google';
import './globals.css';

const display = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--display' });
const ui = Syne({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--ui' });

export const metadata = { title: 'DEADSTOX | Street royalty, made to last', description: 'Limited-run premium tees. New drops, never restocked.' };
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#f5f0e6' };

export default function RootLayout({ children }) {
  return (<html lang="en" className={`${display.variable} ${ui.variable}`}><body>{children}</body></html>);
}

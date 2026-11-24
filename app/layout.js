import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600'], style: ['normal', 'italic'], variable: '--display' });
const ui = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--ui' });

export const metadata = { title: 'DEADSTOX | Street royalty, made to last', description: 'Limited-run premium tees. New drops, never restocked.' };
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#080405' };

export default function RootLayout({ children }) {
  return (<html lang="en" className={`${display.variable} ${ui.variable}`}><body>{children}</body></html>);
}

import './style1.css';
import './style2.css';

export const metadata = {
  title: 'AIO.CORE',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

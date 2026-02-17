import './24a9545adcfd6bb1.css';
import './6809280247a39ba0.css';
import './globals.css'; // Оставь, если этот файл есть в папке app

export const metadata = {
  title: 'AIO.CORE',
  description: 'Semantic Indexing Protocol',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

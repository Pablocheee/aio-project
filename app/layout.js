import './24a9545adcfd6bb1.css';
import './6809280247a39ba0.css';
import './globals.css'; // если он есть

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        {/* Здесь можно добавить фавиконку, если она есть в public */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

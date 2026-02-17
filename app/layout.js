import './style1.css';
import './style2.css';

export const metadata = {
  title: 'AIO.CORE | Semantic Indexing Protocol & RAG Optimization',
  description: 'De-centralized vector optimization tool for AI visibility. Fix Semantic Drift and Context Fragmentation in LLMs. Access Node: 772109.',
  keywords: ['AIO', 'Semantic Indexing', 'RAG Optimization', 'Vector Database', 'Fix Hallucinations', 'Neural Search'],
  authors: [{ name: 'AIO.CORE Protocols' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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

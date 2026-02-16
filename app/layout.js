export const metadata = {
  title: 'AIO.CORE',
  description: 'Autonomous LLM Integration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
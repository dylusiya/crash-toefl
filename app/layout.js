import './globals.css'

export const metadata = {
  title: 'TOEFL iBT AI Crash Course',
  description: 'Practice TOEFL with AI-generated questions and feedback',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
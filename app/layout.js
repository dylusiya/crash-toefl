export const metadata = {
  title: 'TOEFL iBT 2-Day Crash Course',
  description: 'Master the TOEFL with proven strategies, insider tips, and time-saving hacks!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
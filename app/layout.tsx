import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/context/ThemeContext'
import { WireframeProvider } from '@/lib/context/WireframeContext'
import { CommandProvider } from '@/lib/context/CommandContext'
import CommandPalette from '@/components/ui/CommandPalette'
import { ToastProvider } from '@/components/ui/SonnerToast'
import WireframeOverlay from '@/components/ui/WireframeOverlay'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Vishvadeep — Full-Stack Engineer',
  description: 'Portfolio of Vishvadeep, a full-stack engineer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider>
          <WireframeProvider>
            <CommandProvider>
              <CommandPalette />
              <ToastProvider />
              <WireframeOverlay />
              {children}
            </CommandProvider>
          </WireframeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

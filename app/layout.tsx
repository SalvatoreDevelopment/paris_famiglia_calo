import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Viaggio a Parigi – 21/24 Maggio 2025",
  description: "Programma per famiglia Calò",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

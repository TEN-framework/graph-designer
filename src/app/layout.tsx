import { StoreProvider } from "@/store"
import type { Metadata } from "next"

import "@/css/reset.css"
import "@/css/global.css"

export const metadata: Metadata = {
  title: "TEN Graph Designer",
  description: "TEN Graph Designer"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}

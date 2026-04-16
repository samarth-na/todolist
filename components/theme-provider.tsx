"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, useState } from "react"

interface Props {
  children: React.ReactNode
  [key: string]: unknown
}

export function ThemeProvider(props: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{props.children}</>
  }

  return <NextThemesProvider {...props}>{props.children}</NextThemesProvider>
}
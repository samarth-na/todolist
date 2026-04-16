"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

interface Props {
  children: React.ReactNode
  [key: string]: unknown
}

export function ThemeProvider(props: Props) {
  return <NextThemesProvider {...props}>{props.children}</NextThemesProvider>
}
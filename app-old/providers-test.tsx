"use client";

import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function ProvidersTest({ children }: ProvidersProps) {
  return <>{children}</>
}

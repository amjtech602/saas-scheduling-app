// app/providers.tsx
"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

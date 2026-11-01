import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent starter · nextui.dev",
  description: "An AI agent chat with tool calls, approvals, citations, reasoning and streaming, built with Next.js, the AI SDK and nextui.dev components.",
};

// Follow the system theme before first paint, so dark mode never flashes.
const theme = `try{if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}

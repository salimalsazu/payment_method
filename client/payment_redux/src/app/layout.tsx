import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayOutProvider from "./component/LayOutProvider";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorSchemeScript />
        <MantineProvider>
          <LayOutProvider children={children} />
        </MantineProvider>
      </body>
    </html>
  );
}

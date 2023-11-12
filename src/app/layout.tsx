import { inter } from "./fonts";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import "react-multi-carousel/lib/styles.css";
import type { Metadata } from "next";
import { CartStateProvider } from "@/store/globalState";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export const metadata: Metadata = {
  title: "Fashion Shop",
  description: "Generated by Fashion Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${inter.variable}`}
      lang="en"
      suppressHydrationWarning={true}
    >
      <body suppressHydrationWarning={true}>
        <ThemeRegistry>
          <CartStateProvider>{children}</CartStateProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

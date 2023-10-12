import { Montserrat, Roboto_Mono } from "next/font/google";
export const montserrat = Montserrat({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-montserrat",
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

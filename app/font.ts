import { Be_Vietnam_Pro } from "next/font/google";

/** Be Vietnam Pro — font duy nhất của tixora. Gắn `tixoraFont.variable` lên <html>. */
export const tixoraFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

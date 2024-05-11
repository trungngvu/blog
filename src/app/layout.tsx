import Navbar from "@/components/Navbar/Navbar";
import Providers from "./Providers";
import "./globals.css";
import { Poppins, Roboto } from "next/font/google";
import AskAIButton from "@/components/SwipeButton";

import Sidebar from "@/components/Sidebar/Sidebar";
import { LoginModalStore } from "../../store/LoginModalStore";
import LoginModal from "@/components/Modals/LoginModal";

import { Inter } from "next/font/google";
import AboutModal from "@/components/Modals/AboutModal";
import SocialModal from "@/components/Modals/SocialModal";

const interFont = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Story",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={interFont.className}>
        <Providers>
          <Navbar />
          <LoginModal />
          <AboutModal />
          <SocialModal />
          <div className="relative flex mt-20">
            {children}

            <div className="hidden xl:block">
              {" "}
              <Sidebar />
            </div>
          </div>
        </Providers>
        <div className="fixed z-50 bottom-7 right-5">
          <AskAIButton />
        </div>
      </body>
    </html>
  );
}

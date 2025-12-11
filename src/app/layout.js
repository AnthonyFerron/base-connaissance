"use client";

import MyNavbar from "./components/NavBar";
import Footer from "./components/Footer";
import "./globals.css";
import { FiltersProvider } from "./providers/FiltersProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { createContext, useState } from "react";
import { usePathname } from "next/navigation";

export const SidebarContext = createContext();

export default function RootLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();

  // Cacher le header et footer sur la page login
  const isLoginPage = pathname === "/login";

  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <FiltersProvider>
            <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
              {!isLoginPage && <MyNavbar />}
              <main
                className={`transition-all duration-300 ${
                  !isLoginPage && showSidebar ? "pl-64" : "pl-0"
                } ${!isLoginPage ? "pt-[84px]" : ""} flex-1 flex flex-col`}
              >
                {children}
              </main>
              {!isLoginPage && <Footer />}
            </SidebarContext.Provider>
          </FiltersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

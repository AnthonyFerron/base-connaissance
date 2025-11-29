"use client";

import MyNavbar from "./components/NavBar";
import Footer from "./components/Footer";
import "./globals.css";
import { FiltersProvider } from "./providers/FiltersProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { createContext, useState } from "react";

export const SidebarContext = createContext();

export default function RootLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
         <AuthProvider>
        <FiltersProvider>
          <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
            <MyNavbar />
            <div
              className={`transition-all duration-300 ${
                showSidebar ? "pl-64" : "pl-0"
              } pt-[84px] flex-1`}
            >
              {children}
            </div>
          </SidebarContext.Provider>
        </FiltersProvider>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

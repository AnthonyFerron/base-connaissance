import MyNavbar from "./components/NavBar";
import Footer from "./components/Footer";
import "./globals.css";
import { FiltersProvider } from "./providers/FiltersProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <FiltersProvider>
          <MyNavbar />
          {children}
          <Footer />
        </FiltersProvider>
      </body>
    </html>
  );
}

import MyNavbar from "./components/NavBar";
import "./globals.css";
import { FiltersProvider } from "./providers/FiltersProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <FiltersProvider>
          <MyNavbar />
          {children}
        </FiltersProvider>
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "WeatherPWA",
  description: "Consulta el clima de tu ciudad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

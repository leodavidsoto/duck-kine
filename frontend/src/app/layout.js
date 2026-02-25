import './globals.css';

export const metadata = {
  title: 'Duck Kinesiología | Clínica de Kinesiología en Santiago',
  description: 'Clínica de kinesiología integral en Santiago de Chile. Rehabilitación, programas deportivos, kinesiología preventiva y academia digital. Agenda tu hora online.',
  keywords: 'kinesiología, Santiago, Chile, rehabilitación, kinesiología deportiva, fisioterapia',
  openGraph: {
    title: 'Duck Kinesiología',
    description: 'Tu salud en movimiento. Kinesiología integral en Santiago de Chile.',
    type: 'website',
    locale: 'es_CL',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#030712" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

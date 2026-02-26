import './globals.css';

export const metadata = {
  title: 'Duck Kinesiología | Rehabilitación Profesional | Santiago',
  description: 'Kinesiología profesional, rehabilitación y bienestar físico en Santiago de Chile. Evaluación kinésica, rehabilitación deportiva, neurorehabilitación.',
  keywords: 'kinesiología, Santiago, Chile, rehabilitación, kinesiología deportiva, fisioterapia, neurorehabilitación',
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
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#060606" />
        <link rel="shortcut icon" href="/assets/images/favicon.png" type="image/x-icon" />
        <link rel="icon" href="/assets/images/favicon.png" type="image/x-icon" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&family=Sora:wght@100..800&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* Xfolio CSS */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/fonts/css/all.min.css" />
        <link rel="stylesheet" href="/assets/fonts/css/tabler-icons.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/nice-select.css" />
        <link rel="stylesheet" href="/assets/css/odometer.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

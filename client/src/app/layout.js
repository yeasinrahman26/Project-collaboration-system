import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Project Collaboration System",
  description: "Manage projects, tasks, and team collaboratively",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('darkMode') === 'true' || 
                  (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

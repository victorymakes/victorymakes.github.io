import Script from "next/script";
import { env } from "@/lib/env";

export function Analytics() {
  return (
    <>
      {/* Google Analytics */}
      {env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
                        `}
          </Script>
        </>
      )}

      {/* Plausible Analytics */}
      {env.NEXT_PUBLIC_AHREFS_ANALYTICS_ID && (
        <Script
          defer
          data-key={env.NEXT_PUBLIC_AHREFS_ANALYTICS_ID}
          src="https://analytics.ahrefs.com/analytics.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

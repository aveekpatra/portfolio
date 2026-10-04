import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html
      className="h-full scroll-smooth bg-paper antialiased"
      lang="en"
      data-scroll-behavior="smooth"
    >
      <Head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="48x48" />
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link
          rel="icon"
          href="/favicon.png?v=2"
          type="image/png"
          sizes="64x64"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <meta name="theme-color" content="#efefef" />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}[data-signature] path{opacity:1!important;stroke-dasharray:none!important}`}</style>
        </noscript>
      </Head>
      <body className="flex h-full flex-col bg-paper">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

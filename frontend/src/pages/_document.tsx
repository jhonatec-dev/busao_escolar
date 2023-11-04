import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ptBR">
      <Head >
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:type" content="/logo512.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      
    </Html>
  )
}

import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import './globals.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

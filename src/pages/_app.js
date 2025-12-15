import { CacheProvider } from '@emotion/react'
import { zhCN } from '@mui/material/locale'
import Layout from 'components/layout/Layout'
import ThemeWrapper from 'components/ThemeWrapper'
import WindowWrapper from 'components/window-wrapper'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '../../styles/globals.css'
import { AuthProvider } from 'store/auth/AuthContext'
import { store } from 'store/index'
import { createEmotionCache } from 'utils/create-emotion-cache'

const clientSideEmotionCache = createEmotionCache()

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <>
          <Head>
            <title>{process.env.NEXT_PUBLIC_COMPANY}</title>
            <meta name='description' content={process.env.NEXT_PUBLIC_COMPANY} />
            <meta name='keywords' content={process.env.NEXT_PUBLIC_COMPANY} />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>

          <ThemeWrapper>
            <WindowWrapper>
              <Toaster position='top-right' />
              <AuthProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </AuthProvider>
            </WindowWrapper>
          </ThemeWrapper>
        </>
      </CacheProvider>
    </Provider>
  )
}

export default App

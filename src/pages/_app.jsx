import { Geist } from 'next/font/google'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import clsx from 'clsx'

import { PillFooter, PillHeader } from '@/components/PillShell'
import { Scene } from '@/components/Reveal'

import '@/styles/tailwind.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export default function App({ Component, pageProps, router }) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={clsx(
          geist.variable,
          'relative min-h-full bg-paper font-geist font-medium text-ink antialiased',
        )}
      >
        <PillHeader />
        <main>
          {/* The page on its way out steps back quickly, so the next one can tell its own story. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              exit={{
                opacity: 0,
                transition: { duration: 0.18, ease: 'easeIn' },
              }}
            >
              <Scene>
                <Component {...pageProps} />
              </Scene>
            </motion.div>
          </AnimatePresence>
        </main>
        <PillFooter />
      </div>
    </MotionConfig>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Reveal, RevealItem } from '@/components/Reveal'
import { external } from '@/lib/external'

export function ArrowIcon(props) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth="2.25"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.75 9h9M9 14.25 14.25 9 9 3.75" />
    </svg>
  )
}

// "Get in touch", where "in" turns into an arrow on hover.
export function TouchLabel() {
  return (
    <span className="inline-flex items-center gap-[0.25em]">
      <span className="transition-transform duration-500 ease-smooth group-hover:-translate-x-[0.12em]">
        Get
      </span>
      <span className="relative inline-block">
        <span className="block transition-opacity duration-300 group-hover:opacity-0">
          in
        </span>
        <ArrowIcon className="absolute top-1/2 left-1/2 size-[1.05em] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
      <span className="transition-transform duration-500 ease-smooth group-hover:translate-x-[0.12em]">
        touch
      </span>
    </span>
  )
}

// The large rounded button. Links to other sites open in a new tab.
export function PillButton({ href, dark, className, children }) {
  let Component = href.startsWith('/') ? Link : 'a'
  return (
    <Component
      href={href}
      {...external(href)}
      className={clsx(
        'group inline-flex items-center justify-center rounded-full px-6 py-[15px] text-[16px] leading-[24px] font-semibold tracking-[-0.01em] transition-[background-color,transform] duration-300 ease-smooth active:scale-[0.98]',
        dark
          ? 'bg-ink text-white hover:bg-black'
          : 'bg-white text-ink hover:bg-[#f7f7f7]',
        className,
      )}
    >
      {children}
    </Component>
  )
}

// A full-width button at the foot of a card.
export function CardButton({ href, dark, children }) {
  return (
    <a
      href={href}
      {...external(href)}
      className={clsx(
        'group flex items-center justify-center gap-1.5 rounded-full py-3 text-[13px] font-semibold transition-[background-color,transform] duration-300 ease-power3 active:scale-[0.98]',
        dark
          ? 'bg-[#1d1d1d] text-paper hover:bg-black'
          : 'bg-ink text-white hover:bg-black',
      )}
    >
      {children}
      <ArrowIcon className="size-3.5 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
    </a>
  )
}

export function Tags({ dark, items, className }) {
  return (
    <ul className={clsx('flex flex-wrap gap-1.5', className)}>
      {items.map((t) => (
        <li
          key={t}
          className={clsx(
            'rounded-full px-2.5 py-[5px] text-[10px] leading-none font-semibold tracking-[0.04em] uppercase',
            dark ? 'bg-[#1d1d1d] text-[#d4d4d4]' : 'bg-white text-ink',
          )}
        >
          {t}
        </li>
      ))}
    </ul>
  )
}

export function SectionHeading({ title, lede, dark, as = 'h2', className }) {
  return (
    <Reveal
      inView
      material="none"
      step={0.08}
      className={clsx('mx-auto max-w-[440px] text-center', className)}
    >
      <RevealItem
        as={as}
        material="ink"
        className={clsx(
          'text-[30px] leading-[1.16] font-bold tracking-[-0.03em] sm:text-[36px]',
          dark ? 'text-paper' : 'text-ink',
        )}
      >
        {title}
      </RevealItem>
      {lede && (
        <RevealItem
          as="p"
          className={clsx(
            'mt-3 text-[14px] leading-[1.6]',
            dark ? 'text-night-mute' : 'text-mute',
          )}
        >
          {lede}
        </RevealItem>
      )}
    </Reveal>
  )
}

// A rounded band across the page. The nav reads `data-nav` to change colour.
export function Panel({ tone, id, className, children }) {
  return (
    <section
      id={id}
      data-nav={tone}
      className={clsx(
        'mx-3 scroll-mt-4 rounded-[24px] p-4 sm:rounded-[28px] sm:p-8 lg:py-24',
        tone === 'dark' ? 'bg-night' : 'bg-white',
        className,
      )}
    >
      {children}
    </section>
  )
}

// The large page title used at the top of About and Projects.
export function PageTitle({ children, className }) {
  return (
    <Reveal
      as="h1"
      material="ink"
      at={0.1}
      className={clsx(
        'text-[40px] leading-[1.05] font-bold tracking-[-0.035em] sm:text-[56px]',
        className,
      )}
    >
      {children}
    </Reveal>
  )
}

// A screenshot of a website, cropped to its top.
export function Shot({ src, alt, className, sizes }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1440}
      height={900}
      sizes={sizes ?? '(min-width: 1024px) 540px, 100vw'}
      className={clsx('h-full w-full object-cover object-top', className)}
    />
  )
}

export function AppIcon({ src, className }) {
  return (
    <Image
      src={src}
      alt=""
      unoptimized={src.src?.endsWith('.svg')}
      className={clsx('flex-none rounded-[8px] object-cover', className)}
    />
  )
}

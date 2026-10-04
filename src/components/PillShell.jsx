import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { PillButton, TouchLabel } from '@/components/Blocks'
import { WorkshopArt } from '@/components/Isometric'
import { Reveal, RevealItem } from '@/components/Reveal'
import { external } from '@/lib/external'
import { profile } from '@/lib/profile'

// The AP mark: two thin-walled right triangles, the second one upside down.
// The A keeps only the lower half of its hole, under a solid peak. The P keeps
// only the upper half of its hole, a bowl over a solid stem.
export function Mark(props) {
  return (
    <svg
      viewBox="0 0 21.4 14"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      {...props}
    >
      <path d="M0.486 14A0.25 0.25 0 0 1 0.282 13.605L9.547 0.635A0.25 0.25 0 0 1 10 0.78L10 13.75A0.25 0.25 0 0 1 9.75 14ZM5.675 8.805A0.25 0.25 0 0 1 5.879 8.7L8.15 8.7A0.25 0.25 0 0 1 8.4 8.95L8.4 12.15A0.25 0.25 0 0 1 8.15 12.4L3.595 12.4A0.25 0.25 0 0 1 3.392 12.005Z" />
      <path d="M20.914 0A0.25 0.25 0 0 1 21.118 0.395L11.853 13.365A0.25 0.25 0 0 1 11.4 13.22L11.4 0.25A0.25 0.25 0 0 1 11.65 0ZM13 1.85A0.25 0.25 0 0 1 13.25 1.6L17.805 1.6A0.25 0.25 0 0 1 18.008 1.995L15.725 5.195A0.25 0.25 0 0 1 15.521 5.3L13.25 5.3A0.25 0.25 0 0 1 13 5.05Z" />
    </svg>
  )
}

// What the nav floats over: a dark panel or not, whether the page's opening
// section is still under it, and whether the page has scrolled at all.
function useSurface() {
  let [state, setState] = useState({ dark: false, hero: true, scrolled: false })
  let { asPath } = useRouter()

  useEffect(() => {
    let frame = 0
    function under(selector) {
      for (let el of document.querySelectorAll(selector)) {
        let r = el.getBoundingClientRect()
        if (r.top <= 36 && r.bottom >= 36) return true
      }
      return false
    }
    function update() {
      frame = 0
      let next = {
        dark: under('[data-nav="dark"]'),
        hero: under('[data-hero]'),
        scrolled: window.scrollY > 4,
      }
      setState((s) =>
        s.dark === next.dark &&
        s.hero === next.hero &&
        s.scrolled === next.scrolled
          ? s
          : next,
      )
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // A new page renders after the old one fades out, so check again then.
    let late = setTimeout(update, 400)
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      clearTimeout(late)
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [asPath])

  return state
}

const pill =
  'flex items-center rounded-full transition-[color,background-color,box-shadow] duration-500 ease-nav'
const lift = 'shadow-[0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1)]'

export function PillHeader() {
  let { dark, hero, scrolled } = useSurface()
  let { pathname } = useRouter()

  // The logo and links take the colour of a card on whatever is beneath them.
  // The button stays light over the opening section and dark panels, and turns
  // dark everywhere else, so it always stands apart. Once the page moves, a
  // faint shadow lifts the pills off the content.
  let card = dark ? 'bg-[#2e2e2e] text-paper' : 'bg-white text-ink'
  let cta = dark || hero ? 'bg-white text-ink' : 'bg-ink text-paper'
  let shadow = scrolled && lift

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-[15px]">
      <div className="pointer-events-auto flex items-stretch gap-2 whitespace-nowrap">
        <Link
          href="/"
          aria-label="Aveek Patra, home"
          className={clsx(pill, card, shadow, 'w-[42px] justify-center')}
        >
          <Mark className="h-[13px] w-[19.9px] flex-none" />
        </Link>
        <nav
          className={clsx(
            pill,
            card,
            shadow,
            'gap-[14px] px-[15px] py-[10px] text-[13px] leading-[22px]',
          )}
        >
          {[
            ['/projects', 'Projects'],
            ['/about', 'About'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className={clsx(
                'transition-colors',
                pathname === href
                  ? dark
                    ? 'text-paper'
                    : 'text-ink'
                  : dark
                    ? 'text-night-mute hover:text-paper'
                    : 'text-mute hover:text-ink',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <a
          href={`mailto:${profile.emails.personal}`}
          className={clsx(
            pill,
            cta,
            shadow,
            'group px-[15px] py-[10px] text-[13px] leading-[22px] font-semibold',
          )}
        >
          <TouchLabel />
        </a>
      </div>
    </header>
  )
}

// Every page ends here: one way to reach me, then the small print.
export function PillFooter() {
  let links = [
    [profile.social.github, 'GitHub'],
    [profile.social.linkedin, 'LinkedIn'],
    [profile.social.x, 'X'],
  ]

  return (
    <footer className="relative overflow-hidden px-6 pt-28 pb-10 text-center sm:pt-32">
      <Reveal
        inView
        as="h2"
        material="ink"
        className="mx-auto max-w-[12em] text-[34px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[48px]"
      >
        Building something you want to get right?
      </Reveal>
      <Reveal
        inView
        as="p"
        material="text"
        className="mx-auto mt-5 max-w-[440px] text-[16px] leading-[1.55] text-mute"
      >
        I&apos;d love to hear about it. Write to{' '}
        <a
          href={`mailto:${profile.emails.personal}`}
          className="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
        >
          {profile.emails.personal}
        </a>
        , or{' '}
        <a
          href={`mailto:${profile.emails.work}`}
          className="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
        >
          {profile.emails.work}
        </a>{' '}
        about Aturno.
      </Reveal>
      <Reveal inView material="fade" className="-mx-6 flex justify-center">
        <WorkshopArt className="w-full max-w-[1100px] min-w-[620px] flex-none" />
      </Reveal>
      <Reveal
        inView
        material="none"
        step={0.07}
        className="relative flex flex-wrap justify-center gap-2"
      >
        <RevealItem material="object">
          <PillButton href={`mailto:${profile.emails.personal}`} dark>
            <TouchLabel />
          </PillButton>
        </RevealItem>
        <RevealItem material="object">
          <PillButton href={profile.social.linkedin}>LinkedIn</PillButton>
        </RevealItem>
      </Reveal>
      <div className="mx-auto mt-16 flex max-w-[560px] flex-col items-center justify-between gap-3 text-[15px] whitespace-nowrap text-mute sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Aveek Patra, Prague</p>
        <div className="flex gap-4">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              {...external(href)}
              className="transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

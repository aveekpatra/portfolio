import Image from 'next/image'
import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import clsx from 'clsx'

import {
  AppIcon,
  ArrowIcon,
  CardButton,
  Panel,
  SectionHeading,
} from '@/components/Blocks'
import { AgentsArt } from '@/components/Isometric'
import { ProductMedia } from '@/components/Media'
import { Reveal, RevealItem } from '@/components/Reveal'
import { PersonSchema, Seo } from '@/components/Seo'
import { Signature } from '@/components/Signature'
import logoAtollon from '@/images/logos/atollon.jpg'
import markAtollon from '@/images/logos/atollon-mark.png'
import { external } from '@/lib/external'
import { profile } from '@/lib/profile'
import { clientWork, projects } from '@/lib/projects'

const byName = Object.fromEntries(projects.map((p) => [p.name, p]))

// The time in Prague, so people writing from elsewhere know when I'll see it.
const clock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Prague',
})

function subscribe(onChange) {
  let id = setInterval(onChange, 10_000)
  return () => clearInterval(id)
}

function usePragueTime() {
  return useSyncExternalStore(
    subscribe,
    () => clock.format(new Date()),
    () => null,
  )
}

// A little alarm clock showing the real time in Prague. The second hand
// ticks, and pointing at it makes the clock ring.
function PragueClock({ time }) {
  let [h, m] = time.split(':').map(Number)
  // Read once when the clock appears; after that the CSS keeps it ticking.
  let [second] = useState(() => new Date().getSeconds())
  let hour = ((h % 12) + m / 60) * 30
  let minute = m * 6
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mr-[0.22em] inline-block size-[1.08em] origin-[50%_60%] overflow-visible align-[-0.17em] hover:animate-[clock-ring_0.9s_ease-in-out]"
    >
      {/* Bells, then feet, then the face. */}
      <path d="M3.6 7.4a3.6 3.6 0 0 1 5-4.6Z" fill="#232323" />
      <path d="M20.4 7.4a3.6 3.6 0 0 0-5-4.6Z" fill="#232323" />
      <path
        d="m6.8 20.6-1.5 1.9M17.2 20.6l1.5 1.9"
        stroke="#232323"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r="8.6" fill="#232323" />
      <circle cx="12" cy="13" r="7.1" fill="#fff" />
      {[0, 90, 180, 270].map((a) => (
        <circle
          key={a}
          cx="12"
          cy="7.4"
          r="0.62"
          fill="#9d9d9d"
          transform={`rotate(${a} 12 13)`}
        />
      ))}
      <path
        d="M12 13V9.3"
        stroke="#232323"
        strokeWidth="1.7"
        strokeLinecap="round"
        transform={`rotate(${hour} 12 13)`}
      />
      <path
        d="M12 13V7.6"
        stroke="#232323"
        strokeWidth="1.25"
        strokeLinecap="round"
        transform={`rotate(${minute} 12 13)`}
      />
      <g
        className="[transform-origin:12px_13px] animate-[clock-tick_60s_steps(60)_infinite] [transform-box:view-box] motion-reduce:animate-none"
        style={{ animationDelay: `-${second}s` }}
      >
        <path
          d="M12 14.4V7.3"
          stroke="#e5484d"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </g>
      <circle cx="12" cy="13" r="1.05" fill="#e5484d" />
    </svg>
  )
}

// A soft, rounded Czech flag. It tilts a little when you point at it.
function CzechFlag({ className }) {
  return (
    <svg
      viewBox="0 0 22 20"
      aria-hidden="true"
      className={clsx(
        'transition-transform duration-500 ease-smooth hover:-rotate-[8deg]',
        className,
      )}
    >
      <defs>
        <clipPath id="cz-flag">
          <rect width="22" height="20" rx="4.2" />
        </clipPath>
      </defs>
      <g clipPath="url(#cz-flag)">
        <rect width="22" height="10" fill="#f2f2f2" />
        <rect y="10" width="22" height="10" fill="#c92c1f" />
        <path d="M0 0 14.2 10 0 20Z" fill="#1f2a6b" />
        <rect
          x="0.4"
          y="0.4"
          width="21.2"
          height="19.2"
          rx="3.8"
          fill="none"
          stroke="#000"
          strokeOpacity="0.1"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  )
}

// A name in a sentence, with its icon in front. Links get a wavy underline,
// and can show a preview of the site when pointed at.
function Named({ href, icon, preview, children }) {
  let inner = (
    <>
      <span className="relative top-[0.14em] mr-[0.28em] inline-flex">
        {icon}
      </span>
      {children}
    </>
  )
  if (!href) return <span className="whitespace-nowrap">{inner}</span>
  return (
    <a
      href={href}
      {...external(href)}
      className="group/named relative whitespace-nowrap underline decoration-hush decoration-wavy decoration-1 underline-offset-[5px] transition-colors hover:decoration-ink"
    >
      {inner}
      {preview && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-40 block w-[300px] -translate-x-1/2 translate-y-2 scale-[0.96] opacity-0 transition-[opacity,transform] duration-300 ease-power3 group-hover/named:translate-y-0 group-hover/named:scale-100 group-hover/named:opacity-100 group-focus-visible/named:translate-y-0 group-focus-visible/named:scale-100 group-focus-visible/named:opacity-100 max-sm:hidden"
        >
          <span className="relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-[#e4e4e4] shadow-[0_2px_6px_-2px_rgba(0,0,0,0.12),0_24px_48px_-16px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]">
            <Image
              src={preview.src}
              alt=""
              fill
              sizes="300px"
              className="object-cover object-top"
            />
          </span>
        </span>
      )}
    </a>
  )
}

function InlineIcon({ src }) {
  return (
    <Image
      src={src}
      alt=""
      className="size-[1em] rounded-[0.24em] object-cover"
    />
  )
}

function CopyEmail() {
  let [copied, setCopied] = useState(false)
  let email = profile.emails.personal

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex items-center gap-2 rounded-full bg-white py-2.5 pr-4 pl-3.5 transition-[background-color,transform] duration-300 ease-power3 hover:bg-[#f7f7f7] active:scale-[0.98]"
    >
      <span className="relative size-4 text-mute">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 transition-opacity',
            copied && 'opacity-0',
          )}
        >
          <rect x="5" y="5" width="9" height="9" rx="2.25" />
          <path d="M11 5V3.75A1.75 1.75 0 0 0 9.25 2h-5.5A1.75 1.75 0 0 0 2 3.75v5.5C2 10.22 2.78 11 3.75 11H5" />
        </svg>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 text-[#1daf61] transition-opacity',
            !copied && 'opacity-0',
          )}
        >
          <path d="m3 8.5 3 3 7-7" />
        </svg>
      </span>
      <span aria-live="polite">{copied ? 'Copied' : email}</span>
    </button>
  )
}

function SocialPill({ href, children }) {
  return (
    <a
      href={href}
      {...external(href)}
      className="group flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 transition-[background-color,transform] duration-300 ease-power3 hover:bg-[#f7f7f7] active:scale-[0.98]"
    >
      {children}
      <ArrowIcon className="size-3 -rotate-45 text-hush transition-colors group-hover:text-ink" />
    </a>
  )
}

function Hero() {
  let time = usePragueTime()

  return (
    <section
      data-hero=""
      className="px-6 pt-[128px] pb-24 sm:pt-[176px] sm:pb-32"
    >
      <div className="mx-auto max-w-[600px]">
        <h1>
          <span className="sr-only">Aveek Patra</span>
          <Signature className="-ml-1 w-[186px] sm:w-[214px]" />
        </h1>
        <Reveal
          material="none"
          at={0.9}
          step={0.18}
          className="mt-7 space-y-5 text-[19px] leading-[1.55] tracking-[-0.01em] sm:text-[21px]"
        >
          <RevealItem as="p">
            I&apos;m Aveek Patra, a software engineer in{' '}
            <Named icon={<CzechFlag className="h-[0.86em] w-[0.95em]" />}>
              Prague
            </Named>
            {time ? (
              <>
                , where it&apos;s{' '}
                <span className="whitespace-nowrap">
                  <PragueClock time={time} />
                  <span className="tabular-nums">{time}</span>
                </span>{' '}
                right now.
              </>
            ) : (
              '.'
            )}{' '}
            This site is where I keep the things I make.
          </RevealItem>
          <RevealItem as="p">
            I&apos;m the co-founder and CTO of{' '}
            <Named
              href="https://aturno.ai"
              icon={<InlineIcon src={byName.Aturno.logo} />}
              preview={{ src: byName.Aturno.shot, url: 'aturno.ai' }}
            >
              Aturno
            </Named>
            , where we build AI agents for Czech and EU law, and an AI engineer
            at{' '}
            <Named
              href="https://atollon.com"
              icon={<InlineIcon src={markAtollon} />}
              preview={{ src: '/shots/atollon.jpg', url: 'atollon.com' }}
            >
              Atollon
            </Named>
            . On the side, I take on freelance projects too.
          </RevealItem>
        </Reveal>
        <Reveal
          material="none"
          at={1.35}
          step={0.06}
          className="mt-9 flex flex-wrap gap-2 text-[15px]"
        >
          <RevealItem material="object">
            <CopyEmail />
          </RevealItem>
          <RevealItem material="object">
            <SocialPill href={profile.social.x}>X</SocialPill>
          </RevealItem>
          <RevealItem material="object">
            <SocialPill href={profile.social.github}>GitHub</SocialPill>
          </RevealItem>
          <RevealItem material="object">
            <SocialPill href={profile.social.linkedin}>LinkedIn</SocialPill>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}

function RoleHeader({ logo, name, role }) {
  return (
    <div className="flex items-center gap-3">
      <AppIcon src={logo} className="size-9 rounded-[10px]" />
      <div className="min-w-0">
        <h3 className="text-[18px] leading-[22px] font-bold tracking-[-0.03em] text-paper">
          {name}
        </h3>
        <p className="text-[13px] text-night-mute">{role}</p>
      </div>
    </div>
  )
}

function RightNow() {
  return (
    <Panel tone="dark" id="now">
      <SectionHeading
        dark
        title="Right now"
        lede="Where most of my week goes."
      />
      <Reveal
        inView
        material="none"
        step={0.1}
        className="mx-auto mt-12 grid max-w-[1100px] grid-cols-1 gap-3 lg:grid-cols-3"
      >
        <RevealItem
          material="surface"
          className="group flex flex-col rounded-[18px] bg-night-card p-4 ring-1 ring-white/[0.04] lg:col-span-2"
        >
          <RoleHeader
            logo={byName.Aturno.logo}
            name="Aturno"
            role="Co-founder & CTO, since October 2025"
          />
          <ProductMedia name="Aturno" tone="dark" className="mt-4" />
          <p className="mt-5 text-[14px] leading-[1.6] text-night-mute">
            It researches legislation, case law and EU sources, reviews
            contracts and drafts documents, with citations a lawyer can check.
          </p>
          <div className="mt-5">
            <CardButton dark href="https://aturno.ai">
              Visit aturno.ai
            </CardButton>
          </div>
        </RevealItem>
        <RevealItem
          material="surface"
          className="flex flex-col rounded-[18px] bg-night-card p-4 ring-1 ring-white/[0.04]"
        >
          <RoleHeader
            logo={logoAtollon}
            name="Atollon"
            role="AI Engineer, since 2026"
          />
          <AgentsArt className="mx-auto my-6 h-[210px] w-full max-w-[360px] lg:my-auto" />
          <p className="text-[14px] leading-[1.6] text-night-mute">
            Agent pipelines and RAG over CRM data, mostly in Python and Go.
          </p>
          <div className="mt-5">
            <CardButton dark href="https://atollon.com">
              Visit atollon.com
            </CardButton>
          </div>
        </RevealItem>
      </Reveal>
    </Panel>
  )
}

const sideProjects = [
  { project: byName.Speek, cta: 'View on GitHub' },
  { project: byName.Lexyos, cta: 'Visit lexyos.com' },
  { project: byName.Renko, cta: 'Visit renko.app' },
]

function OnTheSide() {
  return (
    <Panel tone="light" className="mt-3">
      <SectionHeading
        title="On the side"
        lede="Products I build in my own time."
      />
      <Reveal
        inView
        material="none"
        step={0.1}
        className="mx-auto mt-12 grid max-w-[1100px] grid-cols-1 gap-3 md:grid-cols-3"
      >
        {sideProjects.map(({ project, cta }) => (
          <RevealItem
            key={project.name}
            material="surface"
            className="group flex flex-col rounded-[24px] bg-paper p-3"
          >
            <ProductMedia name={project.name} />
            <div className="flex flex-1 flex-col px-1.5 pt-4 pb-1">
              <div className="flex items-center gap-2.5">
                <AppIcon src={project.logo} className="size-7" />
                <h3 className="text-[17px] font-bold tracking-[-0.03em]">
                  {project.name}
                </h3>
              </div>
              <p className="mt-3 mb-5 text-[14px] leading-[1.6] text-mute">
                {project.description}
              </p>
              <div className="mt-auto">
                <CardButton href={project.link.href}>{cta}</CardButton>
              </div>
            </div>
          </RevealItem>
        ))}
      </Reveal>
      <Reveal inView material="surface" className="mx-auto mt-3 max-w-[1100px]">
        <Link
          href="/projects#clients"
          className="group flex flex-col items-start gap-4 rounded-[24px] bg-paper p-5 transition-colors hover:bg-[#e9e9e9] sm:flex-row sm:items-center"
        >
          <span className="flex -space-x-2">
            {clientWork.map((c) => (
              <AppIcon
                key={c.name}
                src={c.logo}
                className="size-9 rounded-full bg-white ring-[3px] ring-paper transition-[box-shadow] group-hover:ring-[#e9e9e9]"
              />
            ))}
          </span>
          <span className="flex-1 text-[14px] leading-[1.5] text-mute">
            <span className="font-semibold text-ink">Client websites. </span>
            I&apos;ve also made {clientWork.length} sites for businesses in
            Czechia and Slovenia.
          </span>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            See them
            <ArrowIcon className="size-3.5 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
          </span>
        </Link>
      </Reveal>
    </Panel>
  )
}

export default function Home() {
  return (
    <>
      <Seo
        title="Aveek Patra | Co-founder & CTO of Aturno"
        description="Aveek Patra is a full-stack AI engineer in Prague and the co-founder and CTO of Aturno, which builds AI agents for Czech and EU law."
        path="/"
      >
        <PersonSchema />
      </Seo>
      <Hero />
      <RightNow />
      <OnTheSide />
    </>
  )
}

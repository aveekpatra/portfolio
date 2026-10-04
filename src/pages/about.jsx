import Image from 'next/image'
import clsx from 'clsx'

import {
  AppIcon,
  ArrowIcon,
  PageTitle,
  Panel,
  SectionHeading,
} from '@/components/Blocks'
import { AudienceArt, JourneyArt, StackArt } from '@/components/Isometric'
import { Reveal, RevealItem } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import logoAtollon from '@/images/logos/atollon.jpg'
import logoAturno from '@/images/logos/aturno.jpg'
import logoCzechEase from '@/images/logos/czechease.png'
import logoCzu from '@/images/logos/czu.jpg'
import logoTrafficBalance from '@/images/logos/traffic-balance.jpg'
import portraitImage from '@/images/portrait.jpg'
import { external } from '@/lib/external'

function Intro() {
  return (
    <section
      data-hero=""
      className="px-6 pt-[124px] pb-24 sm:pt-[160px] sm:pb-28"
    >
      <div className="mx-auto grid max-w-[1000px] grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
        {/* A print set down on the desk. Looking at it straightens it and brings out the colour. */}
        <Reveal
          material="surface"
          at={0.4}
          className="mx-auto w-full max-w-[260px] rotate-3 rounded-[22px] bg-white p-2 transition-transform duration-700 ease-smooth hover:rotate-0 lg:order-last lg:mt-4 lg:max-w-none"
        >
          <Image
            src={portraitImage}
            alt="Portrait of Aveek Patra"
            sizes="(min-width: 1024px) 320px, 260px"
            priority
            className="aspect-square rounded-[16px] object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
          />
        </Reveal>
        <div>
          <PageTitle>Hi, I&apos;m Aveek.</PageTitle>
          <Reveal
            material="none"
            at={0.6}
            step={0.14}
            className="mt-8 space-y-6 text-[17px] leading-[1.65] text-mute"
          >
            <RevealItem as="p" className="text-ink">
              I&apos;m an engineer with an artist&apos;s heart, and I love the
              whole of building a product. AI and automation are the tools I
              reach for first.
            </RevealItem>
            <RevealItem as="p">
              Right now all of that goes into Aturno, which I co-founded in
              October 2025 with Martin Slavik, our CEO, and where I&apos;m the
              CTO. We build AI agents for Czech and EU law that research, draft
              and carry legal work from start to finish. I built the retrieval
              that searches legislation, case law and EU sources, the agents
              that research and draft, and the engine that connects them. I
              designed the interface for lawyers who have every reason to
              distrust software, and I own security, infrastructure and system
              design.
            </RevealItem>
            <RevealItem as="p">
              Alongside Aturno I work as an AI engineer at Atollon, building
              agent pipelines and RAG over CRM data, mostly in Python and Go. In
              my own time I build tools in the open, like Speek, a voice
              assistant for macOS that lives in the notch.
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    title: "Who it's for",
    body: "Figuring out who it's for. Planning it. Finding the first people who'll use it.",
    art: AudienceArt,
  },
  {
    title: 'Their journey',
    body: 'Walking through every step of their journey and noticing where it feels wrong.',
    art: JourneyArt,
  },
  {
    title: 'Every layer',
    body: 'Then building every layer: the interface, the frontend, the system logic and the backend it all runs on.',
    art: StackArt,
  },
]

function HowIBuild() {
  return (
    <Panel tone="dark">
      <SectionHeading
        dark
        title="How I build"
        lede="To me it's one piece of work."
      />
      <Reveal
        inView
        material="none"
        step={0.1}
        className="mx-auto mt-12 grid max-w-[1100px] grid-cols-1 gap-3 md:grid-cols-3"
      >
        {steps.map((s, i) => (
          <RevealItem
            key={s.title}
            material="surface"
            className="flex flex-col rounded-[18px] bg-night-card p-4 ring-1 ring-white/[0.04]"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-[18px] leading-[24px] font-bold tracking-[-0.03em] text-paper">
                {s.title}
              </h3>
              <span className="text-[12px] font-semibold text-night-mute tabular-nums">
                0{i + 1}
              </span>
            </div>
            <s.art className="mx-auto my-4 h-[190px] w-full max-w-[340px]" />
            <p className="mt-auto text-[14px] leading-[1.6] text-night-mute">
              {s.body}
            </p>
          </RevealItem>
        ))}
      </Reveal>
    </Panel>
  )
}

function Belief() {
  return (
    <Panel tone="light" className="mt-3">
      <Reveal
        inView
        material="none"
        step={0.12}
        className="mx-auto max-w-[780px]"
      >
        <RevealItem
          as="p"
          material="fade"
          className="text-[13px] font-semibold text-faint"
        >
          What I aim for
        </RevealItem>
        <RevealItem
          as="p"
          material="ink"
          className="mt-5 text-[26px] leading-[1.25] font-semibold tracking-[-0.025em] text-faint sm:text-[34px]"
        >
          I&apos;m heavily inspired by Jony Ive&apos;s design philosophy.{' '}
          <span className="text-ink">
            The hard work should disappear, and what&apos;s left should feel
            simple, even obvious.
          </span>
        </RevealItem>
      </Reveal>
    </Panel>
  )
}

const work = [
  {
    name: 'Aturno',
    role: 'Co-founder & CTO',
    years: '2025 - now',
    logo: logoAturno,
    href: 'https://aturno.ai',
  },
  {
    name: 'Atollon',
    role: 'AI Engineer',
    years: '2026 - now',
    logo: logoAtollon,
    href: 'https://atollon.com',
  },
  {
    name: 'Traffic Balance',
    role: 'Full-stack Developer',
    years: '2025',
    logo: logoTrafficBalance,
    href: 'https://traffic-balance.com',
  },
  {
    name: 'CzechEase Consultants',
    role: 'Web Developer',
    years: '2022 - 2023',
    logo: logoCzechEase,
  },
]

const education = [
  {
    name: 'Czech University of Life Sciences Prague',
    role: "Bachelor's, Informatics",
    years: '2023 - 2026',
    logo: logoCzu,
    href: 'https://www.czu.cz/en',
  },
]

function Row({ org }) {
  let Component = org.href ? 'a' : 'div'
  return (
    <RevealItem as="li" material="surface">
      <Component
        {...(org.href ? { href: org.href, ...external(org.href) } : {})}
        className={clsx(
          'group flex items-center gap-4 rounded-[16px] bg-white px-4 py-3.5 transition-colors',
          org.href && 'hover:bg-[#fafafa]',
        )}
      >
        <AppIcon src={org.logo} className="size-10 rounded-[11px]" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.02em]">
            <span className="truncate">{org.name}</span>
            {org.href && (
              <ArrowIcon className="size-3 flex-none -rotate-45 text-hush transition-colors group-hover:text-ink" />
            )}
          </span>
          <span className="block text-[13px] text-mute">{org.role}</span>
        </span>
        <span className="flex-none text-[13px] text-faint tabular-nums">
          {org.years}
        </span>
      </Component>
    </RevealItem>
  )
}

function Experience() {
  return (
    <section className="px-6 pt-24 sm:pt-28">
      <SectionHeading title="Experience" />
      <div className="mx-auto mt-10 max-w-[640px]">
        <Reveal
          inView
          as="ul"
          material="none"
          step={0.07}
          className="space-y-2"
        >
          {work.map((org) => (
            <Row key={org.name} org={org} />
          ))}
        </Reveal>
        <Reveal
          inView
          as="h3"
          material="fade"
          className="mt-12 mb-4 text-center text-[16px] font-semibold"
        >
          Education
        </Reveal>
        <Reveal inView as="ul" material="none" className="space-y-2">
          {education.map((org) => (
            <Row key={org.name} org={org} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Seo
        title="About Aveek Patra | AI engineer and CTO in Prague"
        description="Aveek Patra co-founded Aturno and built its legal research agents, retrieval and app. AI engineer at Atollon, studying informatics in Prague."
        path="/about"
      />
      <Intro />
      <HowIBuild />
      <Belief />
      <Experience />
    </>
  )
}

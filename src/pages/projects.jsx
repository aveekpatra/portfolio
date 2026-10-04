import Image from 'next/image'
import clsx from 'clsx'

import {
  AppIcon,
  ArrowIcon,
  PageTitle,
  Panel,
  SectionHeading,
  Shot,
} from '@/components/Blocks'
import { LexyosDevices, MacBook } from '@/components/Media'
import { Reveal, RevealItem } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import { external } from '@/lib/external'
import { profile } from '@/lib/profile'
import { clientWork, projects } from '@/lib/projects'

const byName = Object.fromEntries(projects.map((p) => [p.name, p]))

// Two rows of two: the websites, then the apps.
function Card({ className, children }) {
  return (
    <RevealItem
      material="surface"
      className={clsx(
        'group flex flex-col overflow-hidden rounded-[28px] bg-night-card ring-1 ring-white/[0.04]',
        className,
      )}
    >
      {children}
    </RevealItem>
  )
}

function CardText({ icon, title, note, link, children, className }) {
  return (
    <div className={clsx('px-7 pt-7 sm:px-9 sm:pt-9', className)}>
      <div className="flex items-center gap-3">
        {icon && <AppIcon src={icon} className="size-8 rounded-[9px]" />}
        <h3 className="text-[24px] leading-none font-bold tracking-[-0.035em] text-paper">
          {title}
        </h3>
        {note && (
          <span className="mt-0.5 text-[13px] font-medium text-night-mute">
            {note}
          </span>
        )}
      </div>
      <p className="mt-4 max-w-[30em] text-[15px] leading-[1.6] text-night-mute">
        {children}
      </p>
      {link && (
        <a
          href={link.href}
          {...external(link.href)}
          className="group/link mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-paper"
        >
          {link.label}
          <ArrowIcon className="size-3.5 transition-transform duration-300 ease-smooth group-hover/link:translate-x-0.5" />
        </a>
      )}
    </div>
  )
}

// A device or a page standing on the bottom edge of its card.
function Standing({ width, sink, rise = 1.5, className, children }) {
  return (
    <div
      className={clsx('mx-auto mt-auto w-full pt-9', className)}
      style={{ width, marginBottom: `-${sink}` }}
    >
      <div
        className="transition-transform duration-700 ease-power3 group-hover:translate-y-[var(--rise)]"
        style={{ '--rise': `-${rise}%` }}
      >
        {children}
      </div>
    </div>
  )
}

function Page({ src, alt }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-t-[12px] bg-black ring-1 ring-white/[0.08]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 560px, 90vw"
        className="object-cover object-top"
      />
    </div>
  )
}

const { Aturno, Speek, Renko, Lexyos } = byName
const visit = (p, label) => ({ href: p.link.href, label })

function Products() {
  return (
    <Panel tone="dark">
      <SectionHeading dark title="Products" />
      <Reveal
        inView
        material="none"
        step={0.1}
        className="mx-auto mt-12 grid max-w-[1100px] grid-cols-1 gap-3 lg:grid-cols-2"
      >
        <Card>
          <CardText
            icon={Aturno.logo}
            title="Aturno"
            note="Co-founder & CTO"
            link={visit(Aturno, 'Visit aturno.ai')}
          >
            {Aturno.description}
          </CardText>
          <Standing width="88%" sink="2%">
            <Page src={Aturno.shot} alt="The Aturno website" />
          </Standing>
        </Card>
        <Card>
          <CardText
            icon={Renko.logo}
            title="Renko"
            note="Side project"
            link={visit(Renko, 'Visit renko.app')}
          >
            {Renko.description}
          </CardText>
          <Standing width="88%" sink="2%">
            <Page src={Renko.shot} alt="The Renko website" />
          </Standing>
        </Card>

        <Card>
          <CardText
            icon={Speek.logo}
            title="Speek"
            note="Open source"
            link={visit(Speek, 'View on GitHub')}
          >
            {Speek.description}
          </CardText>
          {/* As wide as the Mac beside it in the Lexyos card. */}
          <Standing width="74%" sink="0.8%">
            <MacBook app="Speek" />
          </Standing>
        </Card>
        <Card>
          <CardText
            icon={Lexyos.logo}
            title="Lexyos"
            note="Side project"
            link={visit(Lexyos, 'Visit lexyos.com')}
          >
            {Lexyos.description} It runs on the Mac and on Android.
          </CardText>
          <Standing width="88%" sink="0.8%" rise={0}>
            <LexyosDevices />
          </Standing>
        </Card>
      </Reveal>
    </Panel>
  )
}

function ClientWebsites() {
  return (
    <Panel tone="light" id="clients" className="mt-3">
      <SectionHeading
        title="Client websites"
        lede="Sites I've made for businesses in Czechia and Slovenia."
      />
      <Reveal
        inView
        as="ul"
        material="none"
        step={0.05}
        className="mx-auto mt-12 grid max-w-[1000px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {clientWork.map((c) => (
          <RevealItem as="li" key={c.name} material="surface">
            <a
              href={c.link.href}
              {...external(c.link.href)}
              className="group flex h-full flex-col rounded-[24px] bg-paper p-3 transition-colors hover:bg-[#e9e9e9]"
            >
              <span className="block overflow-hidden rounded-[12px] bg-[#e4e4e4]">
                <Shot
                  src={c.shot}
                  alt={`The ${c.name} website`}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[16/10] transition-transform duration-500 ease-power3 group-hover:scale-[1.02]"
                />
              </span>
              <span className="flex flex-1 flex-col px-1.5 pt-4 pb-1.5">
                <span className="flex items-center gap-2.5">
                  <AppIcon src={c.logo} className="size-7 bg-white" />
                  <span className="text-[16px] font-bold tracking-[-0.02em]">
                    {c.name}
                  </span>
                </span>
                <span className="mt-2 mb-4 text-[14px] leading-[1.55] text-mute">
                  {c.description}
                </span>
                <span className="mt-auto flex items-center gap-1.5 text-[13px] font-semibold text-faint transition-colors group-hover:text-ink">
                  {c.link.label}
                  <ArrowIcon className="size-3 -rotate-45" />
                </span>
              </span>
            </a>
          </RevealItem>
        ))}
      </Reveal>
    </Panel>
  )
}

export default function Projects() {
  return (
    <>
      <Seo
        title="Projects by Aveek Patra | Aturno, Speek, Lexyos, Renko"
        description="Products Aveek Patra has built, including Aturno, Speek, Lexyos and Renko, plus websites made for clients in Czechia and Slovenia."
        path="/projects"
      />
      <section
        data-hero=""
        className="px-6 pt-[124px] pb-20 text-center sm:pt-[160px] sm:pb-24"
      >
        <PageTitle>Things I&apos;ve built</PageTitle>
        <Reveal
          as="p"
          material="text"
          at={0.4}
          className="mx-auto mt-5 max-w-[420px] text-[16px] leading-[1.5] text-mute sm:text-[17px]"
        >
          Products I work on, and websites I&apos;ve made for clients. More on{' '}
          <a
            href={profile.social.github}
            {...external(profile.social.github)}
            className="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
          >
            GitHub
          </a>
          .
        </Reveal>
      </section>
      <Products />
      <ClientWebsites />
    </>
  )
}

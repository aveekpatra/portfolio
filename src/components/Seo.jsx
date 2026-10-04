import Head from 'next/head'

import { profile } from '@/lib/profile'

export const siteUrl = 'https://www.aveek.site'

// Title, description, canonical URL and social preview tags for a page.
export function Seo({ title, description, path = '/', children }) {
  let url = `${siteUrl}${path === '/' ? '/' : path}`
  let image = `${siteUrl}/og.png`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={profile.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={`${profile.name}, co-founder and CTO of Aturno`}
      />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aveek_patra" />
      <meta name="twitter:creator" content="@aveek_patra" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {children}
    </Head>
  )
}

// Tells search engines who this site is about.
export function PersonSchema() {
  let data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: siteUrl,
    image: `${siteUrl}/og.png`,
    jobTitle: 'Co-founder & CTO',
    worksFor: {
      '@type': 'Organization',
      name: 'Aturno',
      url: 'https://aturno.ai',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Czech University of Life Sciences Prague',
      url: 'https://www.czu.cz/en',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Prague',
      addressCountry: 'CZ',
    },
    email: `mailto:${profile.emails.work}`,
    knowsAbout: [
      'Artificial intelligence',
      'AI agents',
      'Legal technology',
      'Full-stack development',
      'Product design',
    ],
    sameAs: [profile.social.github, profile.social.linkedin, profile.social.x],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

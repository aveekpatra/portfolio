import logoAbu from '@/images/logos/abu.svg'
import logoAturno from '@/images/logos/aturno.jpg'
import logoBioscha from '@/images/logos/bioscha.png'
import logoCipher from '@/images/logos/cipher.svg'
import logoJonasWolfl from '@/images/logos/jonaswolfl.png'
import logoLexyos from '@/images/logos/lexyos.png'
import logoPompex from '@/images/logos/pompex.png'
import logoRenko from '@/images/logos/renko.png'
import logoSpeek from '@/images/logos/speek.png'
import logoUrytiru from '@/images/logos/urytiruvlasim.svg'

export const projects = [
  {
    name: 'Aturno',
    description:
      'An AI workspace for lawyers in Czechia and the EU. It does legal research, reviews contracts and drafts documents, with citations you can check.',
    link: { href: 'https://aturno.ai', label: 'aturno.ai' },
    shot: '/shots/aturno.jpg',
    logo: logoAturno,
  },
  {
    name: 'Speek',
    description:
      'A voice assistant for the Mac that sits in the notch. You talk, it types or does the task. Open source.',
    link: {
      href: 'https://github.com/aveekpatra/speek',
      label: 'github.com/aveekpatra/speek',
    },
    shot: '/shots/speek.jpg',
    logo: logoSpeek,
  },
  {
    name: 'Renko',
    description:
      'Describe your business and get available domain names, with prices from different registrars.',
    link: { href: 'https://renko.app', label: 'renko.app' },
    shot: '/shots/renko.jpg',
    logo: logoRenko,
  },
  {
    name: 'Lexyos',
    description:
      'My own productivity app. Tasks, projects and a calendar in one place, with AI search.',
    link: { href: 'https://lexyos.com', label: 'lexyos.com' },
    shot: '/shots/lexyos.jpg',
    logo: logoLexyos,
  },
]

export const clientWork = [
  {
    name: 'U Blanickych rytiru',
    description: 'Website for a restaurant in Vlasim castle.',
    link: { href: 'https://www.urytiruvlasim.cz', label: 'urytiruvlasim.cz' },
    shot: '/shots/urytiru.jpg',
    logo: logoUrytiru,
  },
  {
    name: 'Pompex',
    description: 'Website for an IT services company in Slovenia.',
    link: { href: 'https://pompex.si', label: 'pompex.si' },
    shot: '/shots/pompex.jpg',
    logo: logoPompex,
  },
  {
    name: 'Bioscha',
    description: 'Online shop for natural skincare oils and serums.',
    link: { href: 'https://www.bioscha.cz', label: 'bioscha.cz' },
    shot: '/shots/bioscha.jpg',
    logo: logoBioscha,
  },
  {
    name: 'Jonas Wolfl',
    description: 'Website for a real estate agent in Prague.',
    link: { href: 'https://www.jonaswolfl.cz', label: 'jonaswolfl.cz' },
    shot: '/shots/jonaswolfl.jpg',
    logo: logoJonasWolfl,
  },
  {
    name: 'Abu Restaurant',
    description: 'Website for a Middle Eastern restaurant in Prague.',
    link: {
      href: 'https://abu-tailwind.vercel.app',
      label: 'Visit website',
    },
    shot: '/shots/abu.jpg',
    logo: logoAbu,
  },
  {
    name: 'Cipher',
    description: 'Website for a hospitality recruiting agency.',
    link: {
      href: 'https://cipher-self.vercel.app',
      label: 'Visit website',
    },
    shot: '/shots/cipher.jpg',
    logo: logoCipher,
  },
]

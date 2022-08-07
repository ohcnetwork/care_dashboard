import { parameterize } from './url'

interface Navigation {
  name: string
  href: string
}

export const navigation: (district: string) => Navigation[] = (district) => [
  {
    href: `/district/${parameterize(district)}/capacity`,
    name: 'Capacity',
  },
  {
    href: `/district/${parameterize(district)}/patient`,
    name: 'Patient',
  },
  {
    href: `/district/${parameterize(district)}/tests`,
    name: 'Tests',
  },
  {
    href: `/district/${parameterize(district)}/triage`,
    name: 'Triage',
  },
  {
    href: `/district/${parameterize(district)}/lsg`,
    name: 'LSG',
  },
  {
    href: `/district/${parameterize(district)}/oxygen`,
    name: 'Oxygen',
  },
  {
    href: `/district/${parameterize(district)}/map`,
    name: 'Map',
  },
]

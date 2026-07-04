export const SITE = {
  title: 'Siam Rahman',
  description:
    'Siam Rahman — AI Infrastructure / Backend Engineer. Production RAG systems, MLOps, distributed workflows. Previously at AskTuring.ai and Grab. Looking for what is next.',
  url: 'https://siamrahman29.github.io',
  author: 'Siam Rahman',
  defaultOgImage: '/og/default.png',
  email: 'siam@graduate.utm.my',
  bookingUrl: 'https://cal.com/siamrahman',
  socials: {
    github: 'https://github.com/SiamRahman29',
    linkedin: 'https://www.linkedin.com/in/siamrahman-29/',
    x: 'https://x.com/siam_rahman_',
  },
  resumeUrl: '/siam-rahman-resume.pdf',
} as const;

/** Set to true to show the wandering pixel cat site-wide. */
export const CAT_ENABLED = true;

export const NAV: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Work', href: '/#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/about' },
];

export const EXPERIENCE: ReadonlyArray<{
  company: string;
  role: string;
  period: string;
  location: string;
  href?: string;
  bullets: string[];
  tech: string[];
}> = [
  {
    company: 'AskTuring.ai',
    role: 'Full Stack Engineer',
    period: 'Feb 2025 – May 2026',
    location: 'California, United States (remote)',
    href: 'https://askturing.ai',
    bullets: [
      'Led a **cross-functional epic** that enhanced email ingestion and retrieval in a **production RAG architecture**.',
      'Redesigned the file upload and ingestion pipeline, raising reliability from **70% to 99.95%+** with Dramatiq-based distributed workflows, retries, and reconciler workers.',
      'Implemented **end-to-end observability** with the LGTM stack (Loki, Grafana, Tempo, Mimir) for real-time monitoring and faster incident response.',
    ],
    tech: ['Python', 'Azure', 'Docker', 'Dramatiq', 'LangChain', 'CrewAI', 'LGTM'],
  },
  {
    company: 'Grab (MyTeksi Sdn Bhd)',
    role: 'Full Stack Engineer, Internship',
    period: 'Aug 2024 – Feb 2025',
    location: 'Kuala Lumpur, Malaysia',
    href: 'https://grab.com',
    bullets: [
      'Fixed a **critical MLflow access control bug**, eliminating daily manual password resets for **150+ data scientists** and engineers.',
      'Built MLOps tools with the AI Infrastructure team, supporting **100+ data scientists** across Grab.',
      'Deployed **OIDC-based authentication** with LDAP group access for MLflow, streamlining experiment tracking and service integration.',
      'Built endpoints for a **central API gateway** and feature-serving tool delivering refreshed data to ML pipelines.',
    ],
    tech: ['Go', 'Python', 'Kubernetes', 'AWS', 'MLflow', 'OIDC'],
  },
];

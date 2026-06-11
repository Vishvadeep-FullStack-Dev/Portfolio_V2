-- ════════════════════════════════════════════════════════════
-- Seed Data — Vishvadeep Portfolio
-- ════════════════════════════════════════════════════════════

-- Profile
insert into profile (name, tagline, bio, email, location, available, social, theme, meta)
values (
  'Vishvadeep',
  'Full-Stack Engineer & Creative Developer',
  'I build fast, accessible, and beautiful digital experiences. Passionate about clean architecture, developer tooling, and the intersection of design and engineering. Currently open to exciting opportunities.',
  'vishvadeep@example.com',
  'Ahmedabad, India',
  true,
  '{
    "github": "https://github.com/vishvadeep",
    "linkedin": "https://linkedin.com/in/vishvadeep",
    "twitter": "https://twitter.com/vishvadeep",
    "website": "https://vishvadeep.dev"
  }',
  '{
    "brandPrimary": "#3B82F6",
    "brandAccent": "#06B6D4",
    "preset": "ocean"
  }',
  '{
    "title": "Vishvadeep — Full-Stack Engineer",
    "description": "Portfolio of Vishvadeep, a full-stack engineer specializing in React, Next.js, and Node.js.",
    "ogImage": "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
  }'
)
on conflict do nothing;

-- Projects
insert into projects (title, slug, description, cover_url, demo_url, repo_url, tags, tech_stack, featured, sort_order)
values
  (
    'DevFlow — AI Code Review Platform',
    'devflow',
    'A real-time collaborative code review platform powered by GPT-4 that provides inline suggestions, auto-refactoring, and team analytics. Processes 10k+ reviews per day.',
    'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    'https://devflow.app',
    'https://github.com/vishvadeep/devflow',
    ARRAY['AI', 'Full-Stack', 'Featured'],
    ARRAY['Next.js', 'TypeScript', 'OpenAI', 'Supabase', 'Tailwind'],
    true,
    1
  ),
  (
    'PixelCraft — Design System Builder',
    'pixelcraft',
    'Visual design system builder with real-time preview, component library export, and Figma sync. Adopted by 50+ design teams.',
    'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg',
    'https://pixelcraft.design',
    'https://github.com/vishvadeep/pixelcraft',
    ARRAY['Design Tools', 'Frontend', 'Featured'],
    ARRAY['React', 'Storybook', 'Vite', 'CSS Variables', 'Figma API'],
    true,
    2
  ),
  (
    'TraceQL — Distributed Tracing Dashboard',
    'traceql',
    'Open-source observability dashboard for microservices. Visualises distributed traces, aggregates logs, and provides AI-powered anomaly detection.',
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
    'https://traceql.io',
    'https://github.com/vishvadeep/traceql',
    ARRAY['DevOps', 'Backend', 'Open Source'],
    ARRAY['Go', 'React', 'ClickHouse', 'gRPC', 'Kubernetes'],
    false,
    3
  ),
  (
    'Formly — Headless Form Engine',
    'formly',
    'Schema-driven headless form engine with 30+ field types, conditional logic, and multi-step flows. 2M+ npm downloads.',
    'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
    'https://formly.dev',
    'https://github.com/vishvadeep/formly',
    ARRAY['Open Source', 'Library', 'Frontend'],
    ARRAY['TypeScript', 'React', 'Zod', 'Rollup'],
    false,
    4
  )
on conflict (slug) do nothing;

-- Skills
insert into skills (name, category, level, sort_order) values
  ('TypeScript',       'Languages',        95, 1),
  ('JavaScript',       'Languages',        95, 2),
  ('Go',               'Languages',        75, 3),
  ('Python',           'Languages',        70, 4),
  ('SQL',              'Languages',        85, 5),
  ('React',            'Frontend',         95, 6),
  ('Next.js',          'Frontend',         92, 7),
  ('Framer Motion',    'Frontend',         85, 8),
  ('Tailwind CSS',     'Frontend',         95, 9),
  ('Storybook',        'Frontend',         80, 10),
  ('Node.js',          'Backend',          90, 11),
  ('Fastify',          'Backend',          85, 12),
  ('GraphQL',          'Backend',          80, 13),
  ('gRPC',             'Backend',          72, 14),
  ('Supabase',         'Databases',        90, 15),
  ('PostgreSQL',       'Databases',        88, 16),
  ('Redis',            'Databases',        80, 17),
  ('ClickHouse',       'Databases',        70, 18),
  ('Docker',           'DevOps',           88, 19),
  ('Kubernetes',       'DevOps',           75, 20),
  ('GitHub Actions',   'DevOps',           85, 21),
  ('Terraform',        'DevOps',           70, 22),
  ('Gemini API',       'AI/ML',            85, 23),
  ('OpenAI API',       'AI/ML',            85, 24),
  ('LangChain',        'AI/ML',            72, 25)
on conflict do nothing;

-- Experience
insert into experience (company, role, location, start_date, current, description, highlights, sort_order) values
  (
    'Acme Corp',
    'Senior Full-Stack Engineer',
    'Mumbai, India (Remote)',
    '2022-06-01',
    true,
    'Lead engineer on the platform team responsible for the customer-facing portal and internal tooling. Architected and shipped 3 major product pivots.',
    ARRAY[
      'Reduced page load time by 60% through SSR migration to Next.js 14',
      'Built real-time notification system serving 500k users with zero downtime',
      'Mentored a team of 4 junior engineers and established code review culture',
      'Introduced TypeScript across 3 legacy codebases, eliminating runtime errors by 80%'
    ],
    1
  ),
  (
    'TechStart',
    'Full-Stack Developer',
    'Bangalore, India',
    '2020-07-01',
    false,
    'Founding engineer at a B2B SaaS startup. Designed and built the product from zero to launch including auth, billing, and core product features.',
    ARRAY[
      'Built the core product in 8 weeks — from design to production',
      'Implemented Stripe billing and subscription management',
      'Achieved 99.9% uptime with automated monitoring and alerting',
      'Grew to 300+ paying customers in first year'
    ],
    2
  ),
  (
    'Freelance',
    'Full-Stack Consultant',
    'Remote',
    '2019-01-01',
    false,
    'Worked with 15+ clients across fintech, e-commerce, and SaaS. Specialised in performance optimisation and architecture consulting.',
    ARRAY[
      'Delivered 15+ projects on time and within budget',
      'Specialised in React performance audits and optimisations',
      'Helped 3 startups reduce infrastructure costs by 40%+'
    ],
    3
  )
on conflict do nothing;

-- Certifications
insert into certifications (title, issuer, issue_date, credential_url, sort_order) values
  ('AWS Certified Solutions Architect — Associate', 'Amazon Web Services', '2023-03-15', 'https://aws.amazon.com/certification', 1),
  ('Google Cloud Professional Developer', 'Google', '2022-11-01', 'https://cloud.google.com/certification', 2),
  ('Certified Kubernetes Administrator (CKA)', 'CNCF', '2023-07-10', 'https://www.cncf.io/certification/cka/', 3),
  ('Meta React Native Certificate', 'Meta', '2022-05-20', 'https://www.coursera.org/professional-certificates/meta-react-native', 4)
on conflict do nothing;

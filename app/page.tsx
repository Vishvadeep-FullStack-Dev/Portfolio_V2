import { createPublicClient } from '@/lib/supabase/public'
import NavBar from '@/components/public/NavBar'
import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import ExperienceSection from '@/components/public/ExperienceSection'
import SkillsSection from '@/components/public/SkillsSection'
import CertificationsSection from '@/components/public/CertificationsSection'
import ContactSection from '@/components/public/ContactSection'
import AIChatWidget from '@/components/ui/AIChatWidget'
import PageViewTracker from '@/components/public/PageViewTracker'

export const revalidate = 60

export default async function Home() {
  const supabase = createPublicClient()

  const [profileResult, projectsResult, skillsResult, experienceResult, certificationsResult] =
    await Promise.all([
      supabase.from('profile').select('*').maybeSingle(),
      supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('skills').select('*').order('sort_order', { ascending: true }),
      supabase.from('experience').select('*').order('sort_order', { ascending: true }),
      supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
    ])

  const fallbackProfile = {
    name: 'Vishvadeep',
    tagline: 'Full-Stack Engineer & Creative Developer',
    bio: 'Building fast, accessible, and beautiful digital experiences.',
    email: '',
    location: '',
    avatar_url: null,
    resume_url: null,
    available: true,
    social: {},
    theme: {},
    meta: {},
  }

  const profile = profileResult.data ?? fallbackProfile

  return (
    <main className="relative">
      <NavBar avatarUrl={profile.avatar_url} available={profile.available} />
      <div className="snap-container">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <ProjectsSection projects={projectsResult.data ?? []} />
        <ExperienceSection experience={experienceResult.data ?? []} />
        <SkillsSection skills={skillsResult.data ?? []} />
        <CertificationsSection certifications={certificationsResult.data ?? []} />
        <ContactSection profile={profile} />
      </div>
      <AIChatWidget />
      <PageViewTracker />
    </main>
  )
}

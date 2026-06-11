'use client'

import SplitWorkspace from '@/components/admin/SplitWorkspace'
import ProfileForm from '@/components/admin/ProfileForm'
import ProjectsManager from '@/components/admin/ProjectsManager'
import SkillsManager from '@/components/admin/SkillsManager'
import ExperienceManager from '@/components/admin/ExperienceManager'
import CertificationsManager from '@/components/admin/CertificationsManager'
import MessagesTerminal from '@/components/admin/MessagesTerminal'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import MetaManager from '@/components/admin/MetaManager'
import { User, FolderOpen, Briefcase, Award, Mail, BarChart2, Settings, Code2 } from 'lucide-react'

const sections = [
  { id: 'profile',          label: 'Profile',        icon: User,       component: ProfileForm },
  { id: 'projects',         label: 'Projects',       icon: FolderOpen, component: ProjectsManager },
  { id: 'skills',           label: 'Skills',         icon: Code2,      component: SkillsManager },
  { id: 'experience',       label: 'Experience',     icon: Briefcase,  component: ExperienceManager },
  { id: 'certifications',   label: 'Certifications', icon: Award,      component: CertificationsManager },
  { id: 'messages',         label: 'Messages',       icon: Mail,       component: MessagesTerminal },
  { id: 'analytics',        label: 'Analytics',      icon: BarChart2,  component: AnalyticsDashboard },
  { id: 'meta',             label: 'SEO & Meta',     icon: Settings,   component: MetaManager },
]

export default function AdminDashboard() {
  return <SplitWorkspace sections={sections} defaultSection="profile" />
}

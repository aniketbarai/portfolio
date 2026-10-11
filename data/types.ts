/**
 * Type definitions for the centralized portfolio content.
 * Every section of the site is driven by the typed records in `data/portfolio.ts`.
 */

export type SectionId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export interface NavItem {
  readonly id: SectionId;
  readonly label: string;
}

export interface ExternalLink {
  readonly label: string;
  readonly href: string;
}

export interface Profile {
  readonly name: string;
  readonly monogram: string;
  readonly email: string;
  readonly github: string;
  /** LinkedIn profile URL. `null` hides the link until it is supplied. */
  readonly linkedin: string | null;
  readonly location: string | null;
  readonly status: string;
  readonly title: string;
  readonly headline: string;
  readonly description: string;
  readonly siteName: string;
}

export type ProjectSource = "owned" | "contributor";

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  /** Short problem statement shown in the hover and detail views. */
  readonly problem: string;
  /** What was built, written as a short list. */
  readonly built: readonly string[];
  /** Key technical implementation details. */
  readonly implementation: readonly string[];
  readonly stack: readonly string[];
  /** Role and contribution, stated factually. */
  readonly role: string;
  /** Who authored the repository, verified against the GitHub contributor API. */
  readonly source: ProjectSource;
  readonly github: string;
  readonly live: string | null;
  /** Optional path to a screenshot in /public. The 3D emblem is used when absent. */
  readonly image: string | null;
  readonly accent: "cyan" | "lime" | "silver";
  /** Shape used for this project's 3D emblem in the spatial gallery. */
  readonly emblem: "stack" | "grid" | "rings" | "prism";
  readonly year: string;
}

export type SkillCategoryId =
  | "frontend"
  | "backend"
  | "databases"
  | "languages"
  | "ai"
  | "tools";

export interface Skill {
  readonly name: string;
  /** Concise, honest explanation of how the technology is used. */
  readonly usage: string;
}

export interface SkillCategory {
  readonly id: SkillCategoryId;
  readonly label: string;
  readonly summary: string;
  readonly skills: readonly Skill[];
}

export type ExperienceKind =
  | "client"
  | "project"
  | "leadership"
  | "event"
  | "achievement"
  | "internship";

export interface ExperienceEntry {
  readonly id: string;
  readonly kind: ExperienceKind;
  readonly title: string;
  readonly organization: string;
  /** Human-readable date range, e.g. "May 2026 — Jul 2026". */
  readonly period: string;
  /** ISO year-month of the start, used for ordering. */
  readonly startedOn: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly links?: readonly ExternalLink[];
}

export interface Principle {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly icon: "layers" | "gauge" | "users" | "server" | "git" | "book";
}

export interface AboutContent {
  readonly intro: readonly string[];
  readonly focus: readonly string[];
  readonly interests: readonly string[];
}

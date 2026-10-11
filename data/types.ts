/**
 * Type definitions for the centralized portfolio content.
 * Every section of the site is driven by the typed records in `data/portfolio.ts`.
 *
 * Optional fields (`| null`) are rendered with an honest empty state rather than
 * a placeholder, so nothing on the site ever links to something that does not exist.
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

/** A short, scannable metadata pair shown beside the about copy. */
export interface Fact {
  readonly label: string;
  readonly value: string;
}

export interface Profile {
  readonly name: string;
  readonly monogram: string;
  readonly email: string;
  readonly github: string;
  /** LinkedIn profile URL. `null` hides the link until it is supplied. */
  readonly linkedin: string | null;
  /** Phone number. `null` hides it. Only publish a number you are happy to make public. */
  readonly phone: string | null;
  /** City-level location. `null` hides it. */
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
  /** Repository URL. `null` renders a "source not published" state instead of a dead link. */
  readonly github: string | null;
  readonly live: string | null;
  /** Optional path to a screenshot in /public. The 3D emblem is used when absent. */
  readonly image: string | null;
  readonly accent: "cyan" | "lime" | "silver";
  /** Shape used for this project's 3D emblem in the spatial gallery. */
  readonly emblem: "stack" | "grid" | "rings" | "prism" | "shield" | "pulse";
  /** Year of the work. `null` omits the year instead of guessing one. */
  readonly year: string | null;
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

export type EducationStatus = "current" | "completed";

export interface Education {
  readonly id: string;
  readonly qualification: string;
  readonly institution: string;
  readonly period: string;
  readonly startedOn: string;
  readonly status: EducationStatus;
  /** Optional detail such as a result or a focus area. */
  readonly detail: string | null;
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
  /** Metadata rail: location, study, focus and leadership, at a glance. */
  readonly facts: readonly Fact[];
}

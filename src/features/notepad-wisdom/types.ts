/**
 * Notepad Wisdom Types
 *
 * Types for plan-scoped notepad wisdom system.
 *
 * Ported from oh-my-claudecode with adaptations for oh-my-droid.
 */

export interface WisdomEntry {
  timestamp: string;
  content: string;
}

export type WisdomCategory = 'learnings' | 'decisions' | 'issues' | 'problems';

export interface PlanWisdom {
  planName: string;
  learnings: WisdomEntry[];
  decisions: WisdomEntry[];
  issues: WisdomEntry[];
  problems: WisdomEntry[];
}

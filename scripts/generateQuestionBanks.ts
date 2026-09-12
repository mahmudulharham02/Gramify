// Script to build 400+ Voice Change questions and 200+ Narration questions
import fs from 'fs';
import path from 'path';

interface VoiceTemplate {
  subModule: string;
  active: string;
  passive: string;
  distractors: [string, string, string];
  direction: 'active_to_passive' | 'passive_to_active';
  difficulty: 'easy' | 'medium' | 'hard';
  rule: string;
  formula: string;
  whyCorrect: string;
  tip: string;
  boardRef?: string;
}

// We will construct diverse, comprehensive datasets for each sub-module.

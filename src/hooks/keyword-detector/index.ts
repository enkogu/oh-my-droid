/**
 * Keyword Detector Hook
 *
 * Detects keywords in user prompts and injects appropriate context.
 * Adapted from oh-my-claudecode.
 */

/**
 * Keyword pattern with injection
 */
interface KeywordPattern {
  /** Keywords to match */
  keywords: string[];
  /** Injection message when matched */
  injection: string;
  /** Priority (higher = checked first) */
  priority: number;
  /** Whether match is case-sensitive */
  caseSensitive?: boolean;
}

/**
 * Built-in keyword patterns
 */
const BUILTIN_PATTERNS: KeywordPattern[] = [
  {
    keywords: ['autopilot', 'build me', 'i want a', 'create me a'],
    injection: `<keyword-detected>
[AUTOPILOT MODE DETECTED]
The user wants autonomous execution. Activate the autopilot skill.
</keyword-detected>

---

`,
    priority: 100
  },
  {
    keywords: ['ralph', "don't stop", 'keep going until', 'must complete', 'finish everything'],
    injection: `<keyword-detected>
[RALPH MODE DETECTED]
The user wants persistence until completion. Continue working until all tasks are done.
</keyword-detected>

---

`,
    priority: 90
  },
  {
    keywords: ['ultrawork', 'ulw', 'parallel mode', 'fast mode', 'maximum speed'],
    injection: `<keyword-detected>
[ULTRAWORK MODE DETECTED]
The user wants maximum parallelism. Execute independent tasks simultaneously.
</keyword-detected>

---

`,
    priority: 80
  },
  {
    keywords: ['plan this', 'plan the', 'planning mode', 'create a plan'],
    injection: `<keyword-detected>
[PLANNING MODE DETECTED]
The user wants strategic planning. Start a planning interview to gather requirements.
</keyword-detected>

---

`,
    priority: 70
  },
  {
    keywords: ['analyze', 'debug', 'investigate', 'deep dive', 'root cause'],
    injection: `<keyword-detected>
[ANALYSIS MODE DETECTED]
The user wants deep analysis. Thoroughly investigate the issue.
</keyword-detected>

---

`,
    priority: 60
  },
  {
    keywords: ['search for', 'find in codebase', 'look for', 'where is'],
    injection: `<keyword-detected>
[DEEPSEARCH MODE DETECTED]
The user wants thorough codebase search. Use multiple search strategies.
</keyword-detected>

---

`,
    priority: 50
  }
];

/**
 * Detection result
 */
export interface KeywordDetectionResult {
  /** Whether any keyword was detected */
  detected: boolean;
  /** Matched pattern */
  pattern?: KeywordPattern;
  /** Matched keywords */
  matchedKeywords: string[];
  /** Injection message */
  injection?: string;
}

/**
 * Configuration for keyword detector
 */
export interface KeywordDetectorConfig {
  /** Custom patterns to add */
  customPatterns?: KeywordPattern[];
  /** Patterns to disable (by keyword) */
  disabledPatterns?: string[];
  /** Whether to use built-in patterns */
  useBuiltinPatterns?: boolean;
}

/**
 * Detect keywords in prompt
 */
export function detectKeywords(
  prompt: string,
  config?: KeywordDetectorConfig
): KeywordDetectionResult {
  const useBuiltin = config?.useBuiltinPatterns !== false;
  const disabledSet = new Set(config?.disabledPatterns ?? []);

  // Combine patterns
  const patterns: KeywordPattern[] = [];

  if (useBuiltin) {
    patterns.push(...BUILTIN_PATTERNS);
  }

  if (config?.customPatterns) {
    patterns.push(...config.customPatterns);
  }

  // Filter disabled
  const activePatterns = patterns.filter(p =>
    !p.keywords.some(kw => disabledSet.has(kw))
  );

  // Sort by priority
  activePatterns.sort((a, b) => b.priority - a.priority);

  // Check patterns
  const promptLower = prompt.toLowerCase();

  for (const pattern of activePatterns) {
    const matchedKeywords: string[] = [];

    for (const keyword of pattern.keywords) {
      const searchText = pattern.caseSensitive ? prompt : promptLower;
      const searchKeyword = pattern.caseSensitive ? keyword : keyword.toLowerCase();

      if (searchText.includes(searchKeyword)) {
        matchedKeywords.push(keyword);
      }
    }

    if (matchedKeywords.length > 0) {
      return {
        detected: true,
        pattern,
        matchedKeywords,
        injection: pattern.injection
      };
    }
  }

  return {
    detected: false,
    matchedKeywords: []
  };
}

/**
 * Create the keyword detector hook
 */
export function createKeywordDetectorHook(config?: KeywordDetectorConfig) {
  return {
    /**
     * PreToolUse - Detect keywords and inject context
     */
    preToolUse: (input: {
      session_id: string;
      tool_input: { prompt?: string };
    }): string | null => {
      const prompt = input.tool_input.prompt;
      if (!prompt) return null;

      const result = detectKeywords(prompt, config);
      return result.injection || null;
    },

    /**
     * Direct detection (for external use)
     */
    detect: (prompt: string) => detectKeywords(prompt, config)
  };
}

// Export types
export type { KeywordPattern };

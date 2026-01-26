/**
 * Non-Interactive Environment Constants
 *
 * Patterns and configuration for environment detection.
 * Adapted from oh-my-claudecode.
 */

/**
 * CI environment variables to check
 */
export const CI_ENV_VARS = [
  'CI',
  'GITHUB_ACTIONS',
  'GITLAB_CI',
  'CIRCLECI',
  'TRAVIS',
  'JENKINS_URL',
  'TEAMCITY_VERSION',
  'BUILDKITE',
  'DRONE',
  'AZURE_PIPELINES'
];

/**
 * Docker indicators
 */
export const DOCKER_INDICATORS = [
  '/.dockerenv',
  '/run/.containerenv'
];

/**
 * Non-interactive environment indicators
 */
export const NON_INTERACTIVE_INDICATORS = [
  'NONINTERACTIVE',
  'DEBIAN_FRONTEND',
  'NO_TTY'
];

/**
 * Adaptation message for non-interactive environments
 */
export const NON_INTERACTIVE_ADAPTATIONS = `<non-interactive-environment>

[NON-INTERACTIVE ENVIRONMENT DETECTED]

This session is running in a non-interactive environment. Adaptations:

1. **No User Prompts**
   - Do not ask questions that require user input
   - Make reasonable default choices

2. **Verbose Output**
   - Provide detailed progress updates
   - Log all significant actions

3. **Error Handling**
   - Fail fast on errors
   - Provide clear error messages
   - Suggest fixes that can be applied automatically

4. **Exit Codes**
   - Use appropriate exit codes
   - 0 for success, non-zero for failure

5. **Timeouts**
   - Be mindful of CI timeout limits
   - Provide progress indicators for long operations

</non-interactive-environment>

---

`;

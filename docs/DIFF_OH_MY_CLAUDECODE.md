# oh-my-claudecode 대비 (불가피한 차이 제외) 차이점

이 문서는 `oh-my-claudecode/`(legacy)와 현재 프로젝트(루트) 사이에서 **플랫폼/네이밍 등 불가피한 차이**를 제외하고도 남아있는 차이를 정리합니다.

- 불가피한 차이(플랫폼/경로/네이밍/기본 Hook 입출력 필드 등)는 `DESIGN.md`의 **“10. oh-my-claudecode와의 주요 차이점”**에 이미 정리되어 있으므로 여기서는 반복하지 않습니다.

> 표기 규칙: **KEEP**(의도된 확장/차별점), **SYNC**(기능 동등성 필요), **REVIEW**(의도/방향 확인 필요)

---

## 1) 패키징/배포 스코프 축소 (REVIEW)

**파일:**
- `package.json`
- `oh-my-claudecode/package.json`

**차이:**
- legacy는 `bin`, `exports`, 다수의 runtime `dependencies`, `build:bridge`, `sync-metadata` 등 **배포/CLI 중심 패키징**을 포함합니다.
- 현재는 `tsc/vitest/eslint` 중심의 **최소 devDependencies + dist 빌드**만 존재하고, `bin`/runtime deps가 없습니다.

**영향:**
- oh-my-claudecode가 제공하던 **CLI/런타임 기능을 NPM 패키지로 배포/실행**하는 형태와 동등하지 않습니다.

---

## 2) TypeScript 구현 범위(코드 기능) 대폭 축소 (REVIEW)

**증거(경로):**
- legacy: `oh-my-claudecode/src/**` (hud, analytics, hooks, mcp, cli, tools 등 다수)
- 현재: `src/`는 `state-manager`, `config-loader` 등 소수 파일

**차이:**
- 현재 프로젝트는 “플러그인 런타임(기능 구현)”을 상당 부분 포함하지 않고, **마켓플레이스용 정의/스크립트 중심**으로 보입니다.

**영향:**
- legacy에서 제공하던 HUD/Analytics/MCP/CLI 등 기능이 **동일하게 제공되지 않습니다.**

---

## 3) Hook 이벤트 커버리지/매처/체인 차이 (REVIEW/KEEP)

**파일:**
- 현재: `hooks/hooks.json`
- legacy: `oh-my-claudecode/hooks/hooks.json`

**차이(현재에만 존재):**
- `PreCompact` (`scripts/pre-compact.mjs`)
- `SubagentStop` (`scripts/persistent-mode.mjs`)
- `SessionEnd` (`scripts/session-end.mjs`)
- `Notification` (`scripts/session-idle.mjs`)

**차이(동일 이벤트지만 동작 차이):**
- `PreToolUse.matcher`: legacy는 `"*"`(모든 툴) / 현재는 `"Edit|Write"`로 **범위 축소**
- `PostToolUse`: legacy는 `post-tool-verifier` 1개 / 현재는 `post-tool-verifier` + `error-recovery` **2단 체인**

**영향:**
- PreToolUse에서 수행하던 “툴 실행 전 리마인드/가드”가 **Edit/Write에만 적용**됩니다.
- PostToolUse는 에러 복구가 추가되어 **동작이 확장**되었습니다.

---

## 4) PreToolUse 스크립트의 정책 차이(모든 툴 vs 소스파일 수정 시에만) (REVIEW)

**파일:**
- 현재: `scripts/pre-tool-enforcer.mjs`
- legacy: `oh-my-claudecode/scripts/pre-tool-enforcer.mjs`

**차이:**
- legacy는 “모든 tool 실행 전” 컨텍스트 리마인드를 주는 성격이 강합니다.
- 현재는 `Edit/Write` + (source extension) + (허용 경로 제외) 조건에서만 “delegation reminder”를 출력하는 **정책 기반**입니다.

**영향:**
- 기존의 “항상성 있는 리마인드”가 사라지고, “코드 수정 시에만 가드”로 성격이 바뀝니다.

---

## 5) Keyword detector가 추가 모드를 트리거 (KEEP/REVIEW)

**파일:**
- 현재: `scripts/keyword-detector.mjs`
- legacy: `oh-my-claudecode/scripts/keyword-detector.mjs`

**차이:**
- legacy는 `ultrawork/ultrathink/search/analyze` 중심입니다.
- 현재는 `autopilot`, `ralph`, `eco` 모드 메시지/상태파일 생성까지 포함합니다.

**영향:**
- 동일한 사용자 프롬프트에 대해 **주입되는 모드/상태가 달라질 수 있습니다.**

---

## 6) Skills 세트 차이 (KEEP)

**증거(경로):**
- 현재에만 존재: `skills/planner/SKILL.md`
- legacy에만 존재: `oh-my-claudecode/skills/omc-setup/SKILL.md`, `oh-my-claudecode/skills/learn-about-omc/SKILL.md` (현재는 `omd-setup`, `learn-about-omd`로 대체)

**추가 차이:**
- skills 예제/검증 커맨드가 Android 중심으로 변경된 부분이 있으며, 이는 `skills/README.md`의 “Adaptation Notes”에 일부 명시되어 있습니다.

---

## 7) Droid(Agent) 정의의 tool whitelist 불일치: `TodoWrite` 누락 (SYNC)

**파일:**
- 현재: `droids/executor.md`
- legacy: `oh-my-claudecode/agents/executor.md`

**차이:**
- legacy executor는 frontmatter `tools`에 `TodoWrite`를 포함합니다.
- 현재 executor는 본문에서 TodoWrite를 “NON-NEGOTIABLE”로 요구하지만, frontmatter `tools` 배열에는 `TodoWrite`가 없습니다.

**영향:**
- 플랫폼이 tool whitelist를 엄격히 적용한다면, droid의 자체 규칙(“TodoWrite FIRST”)을 **실행 불가**로 만들 수 있습니다.

---

## 8) tsconfig 옵션 누락 (SYNC)

**파일:**
- 현재: `tsconfig.json`
- legacy: `oh-my-claudecode/tsconfig.json`

**차이:**
- legacy에 있는 `lib`, `types`, `resolveJsonModule` 등이 현재 `tsconfig.json`에는 없습니다.

**영향:**
- JSON import/Node 타입 해석 등에서 프로젝트가 커지면 타입체크/빌드 동작이 달라질 수 있습니다.

---

## 9) Templates 구성 차이 (KEEP)

**증거(경로):**
- legacy: `oh-my-claudecode/templates/rules/*`, `oh-my-claudecode/templates/hooks/*`
- 현재: `templates/commands/*`, `templates/droids/*` (+ `templates/CONVERSION_SUMMARY.md`)

**차이:**
- legacy의 “rules/hooks 템플릿” 중심에서, 현재는 “마켓플레이스용 command/droid 템플릿” 중심으로 재구성되었습니다.

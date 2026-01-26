#!/bin/bash
# oh-my-droid 설치 스크립트
# Factory AI Droid CLI용 멀티 에이전트 오케스트레이션 플러그인

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FACTORY_DIR="${HOME}/.factory"

echo "🤖 oh-my-droid 설치 시작..."
echo ""

# 디렉토리 생성
mkdir -p "${FACTORY_DIR}/droids"
mkdir -p "${FACTORY_DIR}/commands"
mkdir -p "${FACTORY_DIR}/plugins/oh-my-droid"

# 드로이드 설치 (32개)
echo "📦 드로이드 설치 중... (32개)"
cp -r "${SCRIPT_DIR}/templates/droids/"*.md "${FACTORY_DIR}/droids/"
echo "   ✓ ~/.factory/droids/ 에 설치됨"

# 명령어 설치 (8개)
echo "📦 명령어 설치 중... (8개)"
cp -r "${SCRIPT_DIR}/templates/commands/"*.md "${FACTORY_DIR}/commands/"
echo "   ✓ ~/.factory/commands/ 에 설치됨"

# 전체 플러그인 복사 (hooks 포함)
echo "📦 플러그인 파일 복사 중..."
cp -r "${SCRIPT_DIR}/scripts" "${FACTORY_DIR}/plugins/oh-my-droid/"
cp -r "${SCRIPT_DIR}/hooks" "${FACTORY_DIR}/plugins/oh-my-droid/"
cp -r "${SCRIPT_DIR}/skills" "${FACTORY_DIR}/plugins/oh-my-droid/"
cp "${SCRIPT_DIR}/package.json" "${FACTORY_DIR}/plugins/oh-my-droid/"
echo "   ✓ ~/.factory/plugins/oh-my-droid/ 에 설치됨"

# settings.json에 hooks 등록 여부 확인
SETTINGS_FILE="${FACTORY_DIR}/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
    if grep -q '"hooks"' "$SETTINGS_FILE"; then
        echo ""
        echo "⚠️  ~/.factory/settings.json에 이미 hooks가 설정되어 있습니다."
        echo "   수동으로 확인해주세요."
    else
        echo ""
        echo "💡 hooks 활성화를 위해 다음을 settings.json에 추가하세요:"
        echo ""
        cat << 'HOOKS_CONFIG'
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/keyword-detector.mjs", "timeout": 5 }] }],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/session-start.mjs", "timeout": 5 }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/persistent-mode.mjs", "timeout": 5 }] }]
  }
HOOKS_CONFIG
    fi
fi

echo ""
echo "✅ oh-my-droid 설치 완료!"
echo ""
echo "📋 설치된 항목:"
echo "   - 32개 커스텀 드로이드 (~/.factory/droids/)"
echo "   - 8개 슬래시 명령어 (~/.factory/commands/)"
echo "   - Hook 스크립트 (~/.factory/plugins/oh-my-droid/)"
echo ""
echo "🚀 사용법:"
echo "   droid                    # 새 세션 시작"
echo "   ulw <작업>               # Ultrawork 모드"
echo "   /analyze <대상>          # 분석 명령어"
echo "   /code-review             # 코드 리뷰"
echo ""

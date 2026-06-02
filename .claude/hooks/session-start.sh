#!/bin/bash
# Planty Care — SessionStart hook for Claude Code on the web.
# Installs Node dependencies so tests, lint, typecheck, and the build
# work immediately in a fresh cloud session.
set -euo pipefail

# Only run in remote (Claude Code on the web) environments; local dev
# machines already manage their own dependencies.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# `npm install` (not `ci`) so the cached container layer is reused on
# subsequent runs and the step stays idempotent.
npm install --no-audit --no-fund

# Note: Playwright browser binaries are intentionally NOT downloaded here —
# the web sandbox's network policy blocks the Playwright CDN, so E2E runs
# in CI instead (see .github/workflows/e2e.yml).

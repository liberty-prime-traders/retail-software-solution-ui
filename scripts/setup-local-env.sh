#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="$DIR/src/environments/environment.local.ts"
TEMPLATE="$DIR/src/environments/environment.local.template.ts"

if [[ -f "$TARGET" ]]; then
  exit 0
fi

cp "$TEMPLATE" "$TARGET"
echo "Created $TARGET from environment.local.template.ts"

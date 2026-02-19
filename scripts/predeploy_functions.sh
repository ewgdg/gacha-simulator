#!/bin/bash
set -euo pipefail

if ! command -v gio >/dev/null 2>&1; then
  echo "gio is required for safe deletion but was not found."
  exit 1
fi

if [ ! -d ".nuxt" ]; then
  echo "Missing .nuxt build output. Run: npm run build"
  exit 1
fi

if [ -e "functions/.nuxt" ]; then
  gio trash "functions/.nuxt"
fi

cp -R ".nuxt" "functions"

if [ -e "functions/.nuxt/dist/client" ]; then
  gio trash "functions/.nuxt/dist/client"
fi

echo "Prepared functions/.nuxt for Firebase Functions deploy."

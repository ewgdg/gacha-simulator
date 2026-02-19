#!/bin/bash
set -euo pipefail

if ! command -v gio >/dev/null 2>&1; then
  echo "gio is required for safe deletion but was not found."
  exit 1
fi

if [ ! -d ".nuxt/dist/client" ]; then
  echo "Missing .nuxt/dist/client build output. Run: npm run build"
  exit 1
fi

mkdir -p "public"
while IFS= read -r -d '' entry; do
  gio trash "$entry"
done < <(find "public" -mindepth 1 -maxdepth 1 -print0)

mkdir -p "public/_nuxt"
cp -R ".nuxt/dist/client/." "public/_nuxt"

echo "Prepared public/_nuxt for Firebase Hosting deploy."

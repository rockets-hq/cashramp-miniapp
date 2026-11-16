#!/bin/sh
# Adds debug IDs to the build, uploads its source maps to Bugsink when SENTRY_AUTH_TOKEN is set, then deletes every map.
set -u

OUTPUT=dist
CLI=node_modules/.bin/sentry-cli

"$CLI" sourcemaps inject "$OUTPUT" || echo "sentry-cli: debug ID injection failed" >&2

if [ -n "${SENTRY_AUTH_TOKEN:-}" ]; then
  "$CLI" --url https://errors.useaccrue.com sourcemaps --org bugsinkhasnoorgs --project cashramp-miniapp upload "$OUTPUT" \
    || echo "sentry-cli: source map upload failed" >&2
else
  echo "SENTRY_AUTH_TOKEN is not set; skipping the source map upload"
fi

find "$OUTPUT" -name "*.map" -type f -delete

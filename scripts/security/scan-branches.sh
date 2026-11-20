#!/usr/bin/env sh
# Scans git refs for the repo worm without checking anything out or running it.
#
#   scripts/security/scan-branches.sh            # every origin/* branch (fetches first)
#   scripts/security/scan-branches.sh HEAD       # one ref, e.g. in CI
#   scripts/security/scan-branches.sh --no-fetch origin/main origin/develop
#
# Exit code: 0 = all clean, 1 = at least one ref infected.
set -eu
export MSYS_NO_PATHCONV=1  # stop Git Bash rewriting "ref:path" arguments

HERE=$(cd "$(dirname "$0")" && pwd)
. "$HERE/iocs.sh"

# The guard's own files contain the signatures on purpose. public/ is NOT excluded: the worm
# hides payloads there as fake fonts. Real binaries are skipped by `git grep -I`.
# Exact paths only, so nothing else can hide under scripts/security/.
EXCLUDES=":(exclude)scripts/security/iocs.sh :(exclude)scripts/security/scan-branches.sh :(exclude)scripts/security/clean-branches.mjs :(exclude).github/workflows/malware-guard.yml :(exclude)node_modules/"

fetch=1
if [ "${1:-}" = "--no-fetch" ]; then fetch=0; shift; fi

if [ $# -eq 0 ]; then
  [ $fetch -eq 1 ] && git fetch --quiet --prune origin
  set -- $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | grep -v -e '^origin$' -e '/HEAD$')
fi

infected=0
total=0
for ref in "$@"; do
  total=$((total + 1))
  findings=""

  for f in $IOC_FILES; do
    if git cat-file -e "$ref:$f" 2>/dev/null; then findings="$findings file:$f"; fi
  done

  # shellcheck disable=SC2086
  hits=$(git grep -I -l -E "$IOC_PATTERN" "$ref" -- . $EXCLUDES 2>/dev/null | sed "s|^$ref:||" || true)
  for h in $hits; do findings="$findings sig:$h"; done

  # shellcheck disable=SC2086
  pads=$(git grep -I -l -E "$IOC_PADDING_PATTERN" "$ref" -- . $EXCLUDES 2>/dev/null | sed "s|^$ref:||" || true)
  for p in $pads; do findings="$findings padding:$p"; done

  if [ -n "$findings" ]; then
    infected=$((infected + 1))
    echo "INFECTED  $ref  ->$(echo "$findings" | tr ' ' '\n' | sort -u | tr '\n' ' ')"
  else
    echo "clean     $ref"
  fi
done

echo "---"
echo "$infected of $total ref(s) infected"
[ "$infected" -eq 0 ]

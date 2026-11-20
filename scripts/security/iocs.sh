#!/usr/bin/env sh
# Indicators of compromise for the repo worm found in Nov 2026.
# Sourced by scan-branches.sh, clean-branch.sh and the CI guard.
# Every check reads files as text. Nothing here executes repository code.

# Files the worm adds. None of them belong in this project.
IOC_FILES="init .env .vscode/eslint .vscode/eslint-check.cmd .vscode/eslint-check.sh .vscode/tasks.json .vscode/settings.json .vscode/launch.json .vscode/extensions.json .vscode/spellright.dict"

# Content signatures (extended regex):
#   global.i = 'A10-...    obfuscated stage-1 header hidden after whitespace padding
#   eval(proxyInfo)        next.config.ts remote-code loader
#   AUTH_API_KEY           env var holding the base64 loader URL
#   node init              npm-script prefix that runs the loader
#   "runOn": "folderOpen"  VS Code task that auto-runs on folder open
#   npm-ws / 0x/cls        persistent implant and its C2 paths
#   95.135.181.151         implant C2 address
#   0x1eEf0849...          Ethereum wallet the loader reads its C2 from
IOC_PATTERN="global\.i *= *'A[0-9]|eval\(proxyInfo\)|AUTH_API_KEY|node init *&&|\"runOn\" *: *\"folderOpen\"|npm-ws|/0x/cls|95\.135\.181\.151|0x1eEf0849EDa15d87f64e51C73C8442Cf3c8bCEF3"

# The worm pads one line with hundreds of spaces or tabs to push its payload off-screen.
# Hand-written source never has 200+ blank characters between two tokens on one line.
IOC_PADDING_PATTERN="[^[:space:]][[:space:]]{200,}[^[:space:]]"

# Fake asset files that are really JavaScript payloads run by the old tasks.json.
IOC_FILES="$IOC_FILES public/fonts/fa-solid-400.woff2 public/fonts/fa-solid-700.otf"

#!/usr/bin/env bash

set -u

HOST="${1:-campfire.mathnasium.pro}"
INTERVAL="${2:-60}"

if ! [[ "$INTERVAL" =~ ^[1-9][0-9]*$ ]]; then
  echo "Usage: $0 [hostname] [interval-seconds]" >&2
  exit 2
fi

notify_ready() {
  printf '\a'

  if command -v osascript >/dev/null 2>&1; then
    osascript -e "display notification \"https://$HOST is serving a valid certificate\" with title \"HTTPS is ready\""
  fi
}

echo "Watching https://$HOST every ${INTERVAL}s. Press Ctrl-C to stop."

while true; do
  timestamp="$(date '+%Y-%m-%d %H:%M:%S %Z')"

  if curl --fail --silent --show-error --head --location \
    --connect-timeout 10 --max-time 20 \
    "https://$HOST/" >/dev/null 2>&1; then
    printf '\n'
    printf '%s\n' \
      '███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗' \
      '██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗' \
      '█████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║' \
      '██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║' \
      '██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝' \
      '╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝'
    printf '\nhttps://%s/ has a valid HTTPS certificate.\n\n' "$HOST"
    notify_ready
    exit 0
  fi

  if command -v dig >/dev/null 2>&1 && dig +short "$HOST" | grep -q .; then
    echo "[$timestamp] DNS is resolving; HTTPS certificate is not ready yet."
  else
    echo "[$timestamp] DNS is not resolving yet."
  fi

  sleep "$INTERVAL"
done

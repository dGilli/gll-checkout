#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: $0 <csv-file>" >&2
  exit 2
fi

csvfile="$1"

csvjson --no-inference "$csvfile" 2>/dev/null \
    | jq '[.[] | select(.Produkt != null and .Produkt != "Total" and .Durchschnit != null)
        | {name: (.Produkt | gsub("^\\s+|\\s+$"; "")),
           price: (.Durchschnit | gsub("CHF\\s*"; "") | tonumber),
           category: ((.Kategori // "No Category") | gsub("^\\s+|\\s+$"; ""))}]
        | to_entries | map({id: (.key + 1)} + .value)'


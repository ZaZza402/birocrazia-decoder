# Tool Modules Structure

This project is organized around calculator tools.

## Folder map

- `lib/tools/ateco/`: ATECO-specific logic (dictionary, search adapters, helpers).
- `lib/tools/forfettario/`: Forfettario-specific helpers and adapters.
- `lib/tools/shared/`: Cross-tool shared logic/constants used by multiple tools.

## Usage rule

- Tool pages should import from their own tool folder first.
- Cross-tool files should live in `lib/tools/shared/` and be clearly labeled.
- Legacy files under `lib/` stay valid during migration to avoid breakage.

## Current migration state

- ATECO curated dictionary and search adapter are active in `lib/tools/ateco/`.
- Existing `lib/ateco-data.ts` and `lib/ateco-rules-2026.ts` remain the data/runtime base and are consumed by adapters.

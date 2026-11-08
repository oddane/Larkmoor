#!/usr/bin/env bash
# One-time repository settings, labels and branch protection. Re-runnable.
# Usage: REPO=owner/name scripts/github-setup.sh   (needs gh, authenticated with admin rights)
set -euo pipefail
REPO="${REPO:-oddane/Larkmoor}"

gh api -X PATCH "repos/$REPO" \
  -f description="Larkmoor: tokens, layout primitives, accessible components and themes for building websites. DTCG tokens, zero runtime dependencies." \
  -F has_wiki=false -F has_projects=false -F has_issues=true \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true -F allow_auto_merge=true >/dev/null && echo "settings ✓"

gh api -X PUT "repos/$REPO/topics" -H "Accept: application/vnd.github+json" \
  -f "names[]=design-system" -f "names[]=design-tokens" -f "names[]=dtcg" -f "names[]=css" \
  -f "names[]=accessibility" -f "names[]=wcag" -f "names[]=components" -f "names[]=theming" >/dev/null && echo "topics ✓"

label() { gh api -X POST "repos/$REPO/labels" -f name="$1" -f color="$2" -f description="$3" >/dev/null 2>&1 \
  || gh api -X PATCH "repos/$REPO/labels/$(printf %s "$1" | jq -sRr @uri)" -f color="$2" -f description="$3" >/dev/null; }
label "type: bug" "b3261e" "Something is broken"
label "type: proposal" "1f7a4f" "New component, token or theme"
label "type: dependencies" "5f6e65" "Dependency updates"
label "type: docs" "2f62f5" "Documentation"
label "a11y" "7a5c24" "Accessibility impact"
label "status: triage" "d9e0db" "Needs a first look"
echo "labels ✓"

# Branch protection: needs GitHub Pro/Team for private repositories. Skipped with a note if unavailable.
if gh api -X PUT "repos/$REPO/branches/main/protection" -H "Accept: application/vnd.github+json" --input - >/dev/null 2>&1 <<'JSON'
{ "required_status_checks": { "strict": true, "contexts": ["Build and test"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0, "require_code_owner_reviews": false },
  "restrictions": null, "required_linear_history": true, "allow_force_pushes": false, "allow_deletions": false }
JSON
then echo "branch protection ✓"; else echo "branch protection not applied: needs admin rights, and GitHub Pro or Team for private repositories"; fi

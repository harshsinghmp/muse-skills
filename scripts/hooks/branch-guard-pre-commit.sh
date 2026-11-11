#!/bin/sh
# branch-guard-pre-commit — refuse ordinary commits on integration branches.
#
# Three times in one session a change was committed straight onto `dev` and had
# to be moved to a branch afterwards. `git checkout <branch>` can silently fall
# through, so "I was on the wrong branch" is easy to miss until the push.
#
# Merge commits are allowed: back-merging production into the integration branch
# is a normal, intended operation on those branches.
#
#   MUSE_PROTECTED_BRANCHES="dev main trunk"   override the list
#   MUSE_ALLOW_INTEGRATION_COMMIT=1            explicit override
set -eu

PROTECTED="${MUSE_PROTECTED_BRANCHES:-main master trunk dev develop}"
BRANCH="${MUSE_BRANCH_GUARD_BRANCH:-$(git symbolic-ref --short HEAD 2>/dev/null || echo "")}"

[ -n "$BRANCH" ] || exit 0

case " $PROTECTED " in
  *" $BRANCH "*) ;;
  *) exit 0 ;;
esac

# Merges, cherry-picks and reverts are legitimate on integration branches.
[ -e "$(git rev-parse --git-dir)/MERGE_HEAD" ] && exit 0
[ -e "$(git rev-parse --git-dir)/CHERRY_PICK_HEAD" ] && exit 0
[ -e "$(git rev-parse --git-dir)/REVERT_HEAD" ] && exit 0

if [ "${MUSE_ALLOW_INTEGRATION_COMMIT:-}" = "1" ]; then
  exit 0
fi

echo "" >&2
echo "🚫 Refusing to commit directly on '$BRANCH'." >&2
echo "   Create a branch: git switch -c feat/<slug> $BRANCH" >&2
echo "   Or override:     MUSE_ALLOW_INTEGRATION_COMMIT=1 git commit …" >&2
echo "" >&2
exit 1

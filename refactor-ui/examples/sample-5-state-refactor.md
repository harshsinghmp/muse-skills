# 🧪 Sample Refactor: Happy-Path vs. 5-State Anti-Slop Component

This example demonstrates how to transform a brittle, happy-path frontend card into an uncompromising, production-ready component with full 5-state coverage.

---

## ❌ Before: The "AI-Slop" Happy-Path Component

```tsx
// Brittle: Assumes user always exists, bio is short, avatar loads, and request never fails
export function UserProfileCard({ user }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", width: "300px" }}>
      <img src={user.avatar} style={{ width: "50px", borderRadius: "50%" }} />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
      <button onClick={user.onFollow}>Follow</button>
    </div>
  );
}
```

### What breaks:
1. **Empty / Missing User**: Crashes with `TypeError: Cannot read properties of undefined (reading 'avatar')`.
2. **Loading State**: Completely missing; layout pops into view, causing jarring layout shift.
3. **Error State**: Missing network failure handling; follow button spins forever or does nothing.
4. **Success State**: No feedback after clicking follow.
5. **Overflow**: A long name or German translation blows out the `300px` fixed width.

---

## ✅ After: The 5-State Production-Ready Component

```tsx
import React, { useState } from "react";
import { UserPlus, Check, AlertCircle, RefreshCw, UserX } from "lucide-react";

interface UserProfileCardProps {
  user?: {
    id: string;
    name: string;
    handle: string;
    bio: string;
    avatarUrl?: string;
    isFollowing: boolean;
  };
  isLoading?: boolean;
  error?: Error | null;
  onFollow?: (userId: string) => Promise<void>;
  onRetry?: () => void;
}

export function UserProfileCard({
  user,
  isLoading = false,
  error = null,
  onFollow,
  onRetry,
}: UserProfileCardProps) {
  const [isMutating, setIsMutating] = useState(false);
  const [justFollowed, setJustFollowed] = useState(false);

  // 1. LOADING STATE (Geometry-preserving skeleton)
  if (isLoading) {
    return (
      <div
        className="w-full max-w-sm p-5 rounded-xl border border-border bg-card shadow-sm animate-pulse space-y-4"
        aria-label="Loading profile"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-4/5" />
        </div>
        <div className="h-9 bg-muted rounded-lg w-full" />
      </div>
    );
  }

  // 2. ERROR STATE (Inline actionable retry banner)
  if (error) {
    return (
      <div
        role="alert"
        className="w-full max-w-sm p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm space-y-3"
      >
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider">Failed to load profile</p>
            <p className="text-xs text-destructive/90">{error.message || "An unexpected error occurred."}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-destructive"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  // 3. EMPTY STATE (Graceful zero-data handling)
  if (!user) {
    return (
      <div className="w-full max-w-sm p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-3">
        <div className="h-10 w-10 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <UserX className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">User Not Found</h4>
        <p className="text-xs text-muted-foreground">
          This profile either does not exist or has been removed.
        </p>
      </div>
    );
  }

  // Action Handler with optimistic state
  const handleFollowClick = async () => {
    if (!onFollow || isMutating) return;
    setIsMutating(true);
    try {
      await onFollow(user.id);
      setJustFollowed(true);
      setTimeout(() => setJustFollowed(false), 3000);
    } catch {
      // Handled upstream
    } finally {
      setIsMutating(false);
    }
  };

  // 4. LOADED & 5. OVERFLOW STATE
  return (
    <div className="w-full max-w-sm p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between gap-4">
      {/* Header with avatar and defensively truncated text */}
      <div className="flex items-center gap-3.5 min-w-0">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover shrink-0 ring-1 ring-border"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-base">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3
            className="font-semibold text-sm text-foreground truncate"
            title={user.name}
          >
            {user.name}
          </h3>
          <p
            className="text-xs text-muted-foreground truncate"
            title={`@${user.handle}`}
          >
            @{user.handle}
          </p>
        </div>
      </div>

      {/* Bio clamped defensively to 3 lines */}
      <p
        className="text-xs text-muted-foreground leading-relaxed line-clamp-3"
        title={user.bio}
      >
        {user.bio || "No biography provided."}
      </p>

      {/* 4. SUCCESS & ACTION STATE: Dynamic CTA with accessible focus ring */}
      <button
        onClick={handleFollowClick}
        disabled={isMutating}
        aria-live="polite"
        className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
          justFollowed || user.isFollowing
            ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        }`}
      >
        {justFollowed ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span>Following</span>
          </>
        ) : user.isFollowing ? (
          <span>Unfollow</span>
        ) : (
          <>
            <UserPlus className="h-3.5 w-3.5" />
            <span>{isMutating ? "Updating..." : "Follow"}</span>
          </>
        )}
      </button>
    </div>
  );
}
```

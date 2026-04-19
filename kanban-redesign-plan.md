# Kanban Board Redesign Plan

## Overview
A comprehensive redesign of the Kanban board focusing on compactness, visual polish, energetic motion, and consistent design language. The goal is to create a more focused, productive workspace that aligns with the "energetic, focused, intentional" brand personality.

---

## Current Issues Analysis

### Layout Issues
- **Overly spacious**: Cards and columns have excessive padding, wasting screen real estate
- **Inconsistent spacing**: Mix of px-3, py-2.5, p-3 without clear rhythm
- **Wide card footprint**: Task cards feel bloated with unnecessary vertical space
- **Progress section bloat**: Column progress indicators add visual noise without proportional value
- **Header imbalance**: Elements not well-distributed, search feels disconnected

### Visual Polish Issues
- **Inconsistent border radius**: Cards use `rounded-xl`, buttons appear inconsistent
- **Typography hierarchy unclear**: Similar sizing for titles, descriptions, and metadata
- **Color usage**: Column colors are vivid but not harmonized with the neutral palette
- **Opacity patterns**: Done tasks use 0.7 opacity which feels muddy in dark mode
- **Badge styling**: Priority badges lack refinement, appear somewhat generic

### Motion Issues
- **Static interactions**: No visual feedback on drag start/drop
- **Abrupt transitions**: Task movement between columns happens instantly
- **No entrance choreography**: Cards appear without animation
- **Limited hover feedback**: Cards don't respond to user presence
- **Drag shadow**: Missing lift effect during drag operations

---

## Design Direction

### Core Principles
1. **Compact by design**: Every pixel serves a purpose
2. **Energy through motion**: Smooth, purposeful animations that feel responsive
3. **Standardized radius**: Single radius system (lg: 0.5rem) for all elements
4. **Content hierarchy**: Clear visual distinction between title, description, and metadata
5. **Neutral with accents**: Restrained color usage, tinted neutrals

### Spacing Strategy
```
Tight scale (compact):
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)

Standardized component padding:
- Cards: p-3 (12px)
- Buttons: px-3 py-1.5 (12px × 6px)
- Input: px-3 py-2 (12px × 8px)
- Column header: px-3 py-2 (12px × 8px)
```

### Radius Strategy
```
Single standard: --radius-lg (0.5rem)
Applied to:
- All cards
- All buttons
- All inputs
- All dialogs
- All dropdowns
- All badges
```

---

## Implementation Plan by Skill

---

## SKILL: LAYOUT

### 1. Compact Task Cards
**File**: `components/kanban/task-card.tsx`

**Changes**:
- Reduce min-height from 80px to auto (content-driven)
- Change padding from `p-3` to tighter `p-2.5` (10px)
- Remove excessive margin-bottom on description
- Stack metadata horizontally in single row
- Reduce gap between elements to gap-1.5

**Before**:
```tsx
className="min-h-[80px] rounded-xl border border-input bg-card p-3"
```

**After**:
```tsx
className="rounded-lg border border-input bg-card p-2.5"
```

### 2. Narrower Column Layout
**File**: `components/kanban/column.tsx`

**Changes**:
- Reduce column min-width constraints
- Compact column header: remove progress bar section entirely
- Simplify header to: dot + title + count (single row)
- Reduce vertical gaps in task list to gap-1.5
- Standardize padding throughout

**Before**:
```tsx
// Header has 2 rows + progress section
// Padding: px-3 py-2.5, px-3 py-2, then p-3
```

**After**:
```tsx
// Single row header: dot + title + count
// Consistent padding: px-3 py-2 throughout
```

### 3. Better Header Layout
**File**: `components/kanban/header.tsx`

**Changes**:
- Tighter vertical padding: py-2.5 instead of py-4
- Compact search input with consistent radius
- Group related controls with gap-2
- Right-align user actions
- Add visual separator between search/filter and actions

**Layout structure**:
```
[Logo] [Search——————] [Filter] | [TaskCount] [AddButton] [User] [Theme] [Logout]
```

### 4. Consistent Spacing System

**Apply throughout**:
- Header: `py-2.5 px-4`
- Column: `gap-1.5` between cards
- Cards: `p-2.5` internal
- Inline add: `py-1.5` compact
- Dialogs: `p-4` content area

### 5. Narrower Board Container
**File**: `components/kanban/board.tsx`

**Changes**:
- Reduce max-width from 1400px to 1200px
- Tighter gap between columns: gap-3 instead of gap-4/6
- Reduce horizontal padding: px-4 on all breakpoints

---

## SKILL: POLISH

### 1. Standardized Border Radius
**Apply to all components**:

**Files affected**:
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/dialog.tsx`
- `components/ui/badge.tsx`
- `components/kanban/task-card.tsx`
- `components/kanban/column.tsx`
- `components/kanban/add-task-dialog.tsx`
- `components/kanban/inline-add.tsx`

**Standard**: `rounded-lg` (0.5rem) everywhere

### 2. Typography Refinement
**Task Card**:
- Title: `text-sm font-medium` (keep)
- Description: `text-xs text-muted-foreground` with `leading-snug`
- Metadata row: single line, `text-[11px]` font-mono
- Reduce description line-clamp to 1 (from 2)

**Priority Badges**:
- Reduce padding: `px-1.5 py-0.5`
- Smaller text: `text-[10px]`
- Consistent radius: `rounded-lg`

### 3. Color & Contrast Refinement
**Done Task State**:
- Replace `opacity-70` with explicit color: `text-muted-foreground`
- Background: `bg-muted/50` instead of opacity
- Keep strikethrough but make it crisp

**Column Header Colors**:
- Desaturate column colors to harmonize with neutral palette
- Use `oklch` with reduced chroma for subtle tinting

### 4. Interaction States
**Task Card**:
- Hover: `hover:border-primary/50 hover:shadow-sm`
- Active: `active:scale-[0.99]` on click
- Focus: visible focus ring with offset

**Buttons**:
- Hover: `hover:brightness-105`
- Active: `active:scale-[0.98]`
- Loading: spinner state

**Priority Badge**:
- Subtle hover state
- Clear visual hierarchy

### 5. Visual Hierarchy Improvements
**Task Card Structure**:
```
┌────────────────────────────────┐
│ [Title]              [Badge]   │ ← font-medium, prominent
│ Description line...            │ ← muted, smaller
│ [Date]            [Completed]  │ ← monospace, smallest
└────────────────────────────────┘
```

**Column Header Structure**:
```
┌────────────────────────────────┐
│ ● To Do                      3 │ ← Single row, clean
├────────────────────────────────┤
│ Task 1                         │
│ Task 2                         │
│ Task 3                         │
│ [+ Add a task]                 │
└────────────────────────────────┘
```

### 6. Remove Visual Noise
**Eliminate**:
- Progress bars in column headers (adds clutter)
- "3 / 5" count duplication (use single count)
- Excessive borders and separators
- Percentage indicators (unnecessary math)

---

## SKILL: ANIMATE

### 1. Drag & Drop Animations
**File**: `components/kanban/task-card.tsx`

**Drag Start**:
```css
transform: scale(1.02) rotate(1deg);
box-shadow: 0 8px 30px rgba(0,0,0,0.15);
opacity: 0.95;
transition: all 200ms var(--ease-out-quart);
```

**Drag Over Column**:
```css
/* Column highlight */
background-color: var(--muted);
border-color: var(--primary);
transition: all 150ms var(--ease-out-quart);
```

**Drop Animation**:
```css
/* Task entering column */
animation: taskEnter 300ms var(--ease-out-quart);

@keyframes taskEnter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 2. Task Card Hover & Interaction
**Hover Effect**:
```css
transition: transform 150ms var(--ease-out-quart),
            box-shadow 150ms var(--ease-out-quart),
            border-color 150ms var(--ease-out-quart);

&:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: var(--primary);
}
```

**Click Feedback**:
```css
&:active {
  transform: translateY(0) scale(0.99);
  transition-duration: 100ms;
}
```

### 3. Card Entrance Animations
**Initial Load**:
```css
/* Staggered entrance */
animation: cardEnter 400ms var(--ease-out-quart) backwards;
animation-delay: calc(var(--index) * 50ms);

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### 4. Column Header Animations
**Count Changes**:
```css
/* Pulse when count changes */
@keyframes countPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.count-change {
  animation: countPulse 200ms var(--ease-out-quart);
}
```

### 5. Button & Input Micro-interactions
**Button Hover**:
```css
transition: all 150ms var(--ease-out-quart);

&:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

&:active {
  transform: translateY(0);
  transition-duration: 100ms;
}
```

**Input Focus**:
```css
transition: border-color 150ms var(--ease-out-quart),
            box-shadow 150ms var(--ease-out-quart);

&:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary/10);
}
```

### 6. Dialog Animations
**Open**:
```css
/* Backdrop */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Content */
@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

**Close**:
```css
/* Faster exit */
transition: all 200ms var(--ease-out-quart);

@keyframes dialogExit {
  to {
    opacity: 0;
    transform: scale(0.97) translateY(4px);
  }
}
```

### 7. Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## CSS Custom Properties to Add

### globals.css additions:
```css
:root {
  /* Easing curves */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  
  /* Compact spacing */
  --space-1: 0.25rem;
  --space-1\.5: 0.375rem;
  --space-2: 0.5rem;
  --space-2\.5: 0.625rem;
  --space-3: 0.75rem;
  
  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-drag: 0 8px 30px rgba(0, 0, 0, 0.12);
  
  /* Animation durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

---

## Component-Specific Changes

### TaskCard (task-card.tsx)
1. ✓ Compact padding (p-2.5)
2. ✓ Standard radius (rounded-lg)
3. ✓ Hover lift effect
4. ✓ Active scale feedback
5. ✓ Entrance animation support
6. ✓ Drag lift effect
7. ✓ Reduced description lines (1)
8. ✓ Inline metadata row

### KanbanColumn (column.tsx)
1. ✓ Remove progress bar section
2. ✓ Single-row header
3. ✓ Compact spacing (gap-1.5)
4. ✓ Drag-over highlight
5. ✓ Count pulse animation
6. ✓ Standard radius
7. ✓ Reduced padding

### KanbanHeader (header.tsx)
1. ✓ Tighter vertical padding
2. ✓ Better horizontal distribution
3. ✓ Consistent button/input styling
4. ✓ Standard radius everywhere
5. ✓ Visual separator

### InlineAdd (inline-add.tsx)
1. ✓ Compact design
2. ✓ Hover/Focus states
3. ✓ Smooth expand/collapse
4. ✓ Standard radius

### AddTaskDialog (add-task-dialog.tsx)
1. ✓ Entrance animation
2. ✓ Exit animation
3. ✓ Standard radius on all elements
4. ✓ Form field consistency

### UI Components
1. ✓ Button: standard radius, hover/active states
2. ✓ Input: standard radius, focus ring
3. ✓ Badge: compact, standard radius
4. ✓ Dialog: backdrop + content animations
5. ✓ Select: standard radius

---

## Implementation Order

### Phase 1: Layout Foundation
1. Update board.tsx (max-width, gaps)
2. Update column.tsx (compact header, spacing)
3. Update task-card.tsx (compact design)
4. Update header.tsx (better distribution)

### Phase 2: Polish Pass
1. Standardize all radii to rounded-lg
2. Refine typography (sizes, weights, colors)
3. Improve interaction states (hover, active, focus)
4. Remove visual noise (progress bars, etc.)

### Phase 3: Motion Layer
1. Add CSS custom properties (easing, durations)
2. Implement drag & drop animations
3. Add card entrance animations
4. Add micro-interactions (buttons, inputs)
5. Add dialog animations
6. Implement reduced motion support

### Phase 4: Final Polish
1. Cross-browser testing
2. Reduced motion verification
3. Performance check (60fps)
4. Edge case handling

---

## Success Criteria

- [ ] Board fits comfortably on 13" laptop screen
- [ ] All elements use consistent `rounded-lg` radius
- [ ] Cards are noticeably more compact (smaller footprint)
- [ ] Header feels balanced and intentional
- [ ] Drag & drop feels responsive with smooth feedback
- [ ] Animations run at 60fps
- [ ] Reduced motion preference respected
- [ ] No visual regressions in dark/light modes
- [ ] Typography hierarchy is clear and scannable
- [ ] No "corporate/clinical" vibes — energetic and focused

---

## Anti-Patterns to Avoid

- ❌ Don't use different radii (rounded-md, rounded-xl, rounded-2xl)
- ❌ Don't add decorative elements (shadows on everything)
- ❌ Don't animate layout properties (width, height)
- ❌ Don't use bounce/elastic easing
- ❌ Don't clutter with progress bars
- ❌ Don't use arbitrary spacing values
- ❌ Don't add border-left accents (absolute ban)
- ❌ Don't use gradient text (absolute ban)

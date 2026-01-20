# ChoreShare

ChoreShare is a lightweight SwiftUI concept app for tracking household chores, the most recent completion date, the person who completed them, and how often each chore should repeat.

## Collaboration model
ChoreShare is designed around **CloudKit public database sync** so both partners see the same list and completion history. This is the simplest shared data option because it requires no additional backend or sign-in UI.

**Setup steps:**
1. Create an iOS app target in Xcode named `ChoreShare`.
2. Enable the **iCloud** capability and check **CloudKit**.
3. Set the CloudKit container identifier in `ChoreShareApp.swift` to match your bundle's container (e.g. `iCloud.com.yourcompany.ChoreShare`).
4. Build and run on two devices signed into iCloud to see shared data.

## Data model
- **Chore**: Title, notes, assigned person, frequency (every N weeks), and last completion date.
- **Person**: Display name and color, so tasks feel assigned to a real person rather than a text tag.

## UI highlights
- Polished card layout with progress chips for frequency and assignment.
- Timeline-style detail view with clear “last done” and “due next” information.
- Completion button updates the last completed date in one tap.

## Screens
- **Home**: list of upcoming and overdue chores.
- **Detail**: timeline card + completion action.
- **New chore**: simple form with frequency and assignee picker.

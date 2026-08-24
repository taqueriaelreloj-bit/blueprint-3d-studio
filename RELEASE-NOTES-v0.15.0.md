# Blueprint 3D Studio v0.15.0

## Improvements

- Added a dedicated 3D sectional model for the 16-foot double garage door.
- Garage doors now render as four stacked sectional panels instead of a generic hinged door slab.
- Added a center reinforcement/mullion detail so the 3D garage opening reads correctly at a glance.
- Preserved full wall geometry above door and window openings; openings cut only the required lower portion of the wall.
- Kept the v0.14 all-line detection overlay and structural classification workflow.
- Source restoration now automatically applies both the v0.14 and v0.15 upgrades before launch.

## Current workflow

1. Upload blueprint PDF.
2. Detect and strengthen all lines.
3. Classify structural walls separately from dimensions and annotations.
4. Review/add doors, windows and garage openings.
5. Edit the 2D plan with project-wide Undo/Redo.
6. Generate and review the 3D model.

# Blueprint 3D Studio v0.14.0

## Blueprint line workflow

- Keeps every detected line visible as a strengthened pre-classification overlay.
- Structural classification happens after line detection instead of hiding rejected geometry immediately.
- Adds a Show / Hide All Detected Lines control to the AI Wall Classifier review card.
- Dimension, annotation and rejected geometry remain visible in a lighter gray while structural candidates are emphasized.
- The final wall model still uses confidence filtering, so measurement lines are not converted into 3D walls.

## Garage support

- Added a dedicated 16 ft double garage door to the Architecture > Doors catalog.
- Added a garage-door 2D blueprint symbol with segmented overhead-door panels.
- Garage doors remain editable like the existing door and window openings.

## Versioning

- Application, installer and launcher now identify as v0.14.0.
- Source restoration automatically applies the v0.14 upgrade after restoring the preserved v0.13 source bundle.

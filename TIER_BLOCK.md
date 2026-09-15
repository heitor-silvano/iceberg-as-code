# TierBlock

The `TierBlock` component is responsible for rendering individual levels (tiers) of the iceberg.

## Alpha Behavior

The `textAlpha` controls both the background color opacity and the border opacity of each item within a tier.
Specifically:
- **Background**: White background (`rgba(255, 255, 255, alpha)`)
- **Border**: Sky-300 border (`rgba(125, 211, 252, alpha)`)
- **Shadow**: `boxShadow` with an alpha of `0.05 * alpha` (`rgba(0, 0, 0, ...)`)

## Text Color Logic

To ensure readability when the background is highly transparent, the text color changes dynamically:
- If `textAlpha < 25`, items starting from the **second level** (index > 0) will have white text instead of the default slate-800 color.
- The first level always retains its default text color regardless of alpha, as the background image behind it typically allows it.

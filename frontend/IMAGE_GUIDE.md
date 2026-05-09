# Image Guide

The project keeps its current local image assets unchanged.

## Current approach

- Product, banner, and category images are served from `frontend/public/images/...`.
- The storefront already references those local assets directly.
- No remote image provider is required for the current build.

## Recommended conventions

- Product cards: around `300x300`
- Category tiles: around `200x200`
- Service banners: around `400x300`
- Hero or feature banners: `800px` wide or larger

## When adding new assets

- Keep them inside `frontend/public/images/`
- Use lowercase, hyphenated file names
- Prefer optimized `jpg`, `png`, or `webp` files
- Keep aspect ratios consistent within each section

## Next.js note

If you later decide to load remote images, update `frontend/next.config.ts` with the allowed domains before using them.

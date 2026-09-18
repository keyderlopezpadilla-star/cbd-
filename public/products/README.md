# Product images

Placeholder location for catalogue product photography.

The mock commerce data (`lib/commerce/mock-data.ts`) references images here by
path, e.g. `/products/amnesia-haze-interior.jpg`. Drop the real product photos
here using the same file names (or update the `images` array in the mock data /
future backend adapter).

Recommended: square (1:1) crops, ≥ 1000px, optimised JP/WebP. `next/image`
handles responsive sizing and format negotiation.

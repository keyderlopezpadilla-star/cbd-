/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    // Product/brand imagery ships as lightweight local SVG placeholders until
    // real photography is dropped into public/products. Allowing SVG lets
    // next/image serve them; the CSP header keeps them inert.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // three / @react-three packages ship modern ESM; transpile to be safe across bundlers.
  transpilePackages: ["three"],
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // Sanity Studio (and next-sanity) call React 19.2 hooks like useEffectEvent
  // that aren't exposed by Next's bundled "react-builtin". Letting Next
  // transpile them forces resolution against the project's own React.
  transpilePackages: ["sanity", "next-sanity", "@sanity/vision"],
};

export default nextConfig;

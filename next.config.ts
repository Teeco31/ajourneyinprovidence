import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Contentful resizes an image the first time each size is asked for, then caches it. Few sizes means few cold requests
    // and a warm cache after the first visits. These cover phones, tablets and laptops.
    deviceSizes: [480, 828, 1200, 1920],
    imageSizes: [96, 192, 384],
  },
};

export default nextConfig;

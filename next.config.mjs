import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: ({ request, url }) =>
          request.method === "GET" &&
          url.origin === self.location.origin &&
          url.pathname === "/api/weather",
        handler: "NetworkFirst",
        options: {
          cacheName: "weather-by-location",
          networkTimeoutSeconds: 5,
          cacheableResponse: {
            statuses: [200],
          },
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: ({ request, url }) =>
          request.destination === "image" &&
          url.origin === self.location.origin,
        handler: "CacheFirst",
        options: {
          cacheName: "weather-images",
          cacheableResponse: {
            statuses: [200],
          },
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
    ],
  },
};

export default withPWA(nextConfig);
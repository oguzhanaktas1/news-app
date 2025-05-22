import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true, // SEO için kalıcı yönlendirme (301)
      },
    ];
  },
};

export default nextConfig;

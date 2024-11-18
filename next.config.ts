import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'wallpapers.com',
          port: '',
          pathname: '/images/hd/**',
        },
        {
          protocol: 'https',
          hostname: 'image.api.playstation.com',
          port: '',
          pathname: '/vulcan/ap/rnd/202406/0500/**',
        },
      ],
    }
};

export default nextConfig;

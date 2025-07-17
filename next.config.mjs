/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "raw.githubusercontent.com",
      "sparrowswap.com",
      "assets.coingecko.com",
      "img.fotofolio.xyz",
      "arweave.net",
      "shdw-drive.genesysgo.net",
      "nftstorage.link",
      "www.arweave.net",
      "ipfs.io",
      "gateway.pinata.cloud",
      "api.helius.xyz",
      "solanafm.com",
      "cdn.jsdelivr.net",
      "privy.io",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    })

    config.externals.push("pino-pretty", "lokijs", "encoding")

    return config
  },
  experimental: {
    serverActions: {},
  },
}

export default nextConfig

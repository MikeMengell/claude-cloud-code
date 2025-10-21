/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Uncomment and update if deploying to a subpath (e.g., https://username.github.io/repo-name/)
  // basePath: '/claude-cloud-code',
  // assetPrefix: '/claude-cloud-code/',
}

module.exports = nextConfig

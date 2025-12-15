const withTM = require('next-transpile-modules')(['react-d3-speedometer'])

const nextConfig = {
  // reactStrictMode: true,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = withTM(nextConfig)

module.exports = nextConfig

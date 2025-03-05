

const config = require('config')
const constants = config.get('constants')

/** @type {import('next').NextConfig} */

const rewrites = async () => {
  return [
    {
      source: '/orbisapi/:path*',
      destination: 'http://localhost:9000/:path*' // Proxy to Backend
    }
  ]
}

const redirects = async () => {
  return [
    {
      source: '/mantenimientos',
      destination: constants.publicPath,
      basePath: true,
      permanent: false
    }
  ]
}

const nextConfig = {
  env: {
    ...constants
  },
  images: {

  },
  assetPrefix: constants.publicPath,
  basePath: constants.publicPath,
  // redirects,
  compiler: {
    styledComponents: true
  },
  rewrites,
  reactStrictMode: true,
  output: 'export', // utilizar para ambiente docker
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig

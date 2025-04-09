/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = {
  output: 'export',  // Enable static export
  // Other configurations can go here
};

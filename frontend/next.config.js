/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const rewrites = async () => {
    return [
      {
        source: "/python-api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = () => {
  // const rewrites = async () => {
  //   return [
  //     {
  //       source: "/python-api/:path*",
  //       destination: "http://127.0.0.1:80/:path*",
  //     },
  //   ];
  // };
  return {
    reactStrictMode: true,
  };
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack, nextRuntime }) => {
    if (nextRuntime === "edge") {
      if (webpack) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
            resource.request = resource.request.replace(/^node:/, "");
          })
        );
      }

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: false,
        os: false,
        path: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    return config;
  },
};

export default nextConfig;

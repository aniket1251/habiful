module.exports = {
  apps: [
    {
      name: "habiful-api",
      script: "dist/src/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

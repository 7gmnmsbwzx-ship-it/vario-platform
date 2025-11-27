module.exports = {
  apps: [
    {
      name: 'vario-platform',
      script: 'npx',
      args: 'next dev --port 3000 --hostname 0.0.0.0',
      cwd: '/home/user/bento-clone',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}

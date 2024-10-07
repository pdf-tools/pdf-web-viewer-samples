module.exports = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
}

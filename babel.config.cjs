// babel.config.cjs
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }], // Transforms modern JavaScript
    '@babel/preset-react', // Transforms JSX
  ],
  plugins: [
    // Add this plugin to handle import.meta
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString('process');
          },
        },
      };
    },
  ],
};
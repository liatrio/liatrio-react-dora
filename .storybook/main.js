module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-swc', '@chromatic-com/storybook', 'storybook-dark-mode'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  staticDirs: [{from:'../src/assets',to:'/src/assets'}]
}

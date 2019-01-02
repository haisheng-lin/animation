module.exports = {
  entry: {
    animation: './src/animation.js',
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js', // [name] 是 entry 中的 key，也就是 animation
    library: 'animation',
    libraryTarget: 'umd',
  },
};
module.exports = function(gulp, plugins) {
  return function() {
    return gulp.watch(['./src/*.js', './src/**/*.js'], ['scripts:all']);
  }
};

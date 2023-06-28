const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const del = require("del");

const config = {
  size: {
    showFiles: true
  }
};

gulp.task("css:clean", () => del(["dist/css"]));

gulp.task("css", () =>
  gulp
    .src("src/css/*.css")
    .pipe(
      $.postcss([
        require("postcss-import")(),
        require("postcss-url")(),
        require("postcss-cssnext")()
      ])
    )
    .pipe($.cssnano())
    .pipe(gulp.dest("dist/css"))
    .pipe($.livereload())
    .pipe($.size({ ...config.size, title: "css" }))
);

gulp.task("js:clean", () => del(["dist/js"]));

gulp.task("js", () =>
  gulp
    .src("src/js/*.js")
    .pipe(gulp.dest("dist/js"))
    .pipe($.livereload())
    .pipe($.size({ ...config.size, title: "js" }))
);

gulp.task("img:clean", () => del(["dist/img"]));

gulp.task("img", () =>
  gulp
    .src("src/img/*.svg")
    .pipe(gulp.dest("dist/img"))
    .pipe($.livereload())
    .pipe($.size({ ...config.size, title: "img" }))
);

gulp.task("html:clean", () => del(["dist/*.html"]));

gulp.task("html", () =>
  gulp
    .src("src/*.html")
    .pipe($.nunjucks.compile())
    .pipe(
      $.htmlmin({
        removeWhitespace: true
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe($.livereload())
    .pipe($.size({ ...config.size, title: "html" }))
);

gulp.task(
  "clean",
  gulp.parallel("css:clean", "js:clean", "img:clean", "html:clean")
);

gulp.task("build", gulp.parallel("css", "js", "img", "html"));

gulp.task("watch", () => {
  $.livereload.listen();

  gulp.watch("src/**/*.css", gulp.series("css"));
  gulp.watch("src/**/*.js", gulp.series("js"));
  gulp.watch("src/**/*.svg", gulp.series("img"));
  gulp.watch("src/**/*.html", gulp.series("html"));
});

gulp.task("serve", () =>
  gulp.src("dist").pipe(
    $.webserver({
      livereload: true
    })
  )
);

gulp.task("start", gulp.series("build", gulp.parallel("watch", "serve")));



const gulp = require("gulp");
const ts = require("gulp-typescript")
var uglyfly = require('gulp-uglyfly');



function tsc(cb) {
    cb()
    var tsResult = gulp.src("main/src/**/*.ts")
        .pipe(ts({}))

    return tsResult.js
        // .pipe(uglyfly())
        .pipe(gulp.dest("app/main"));

}
function staticHandler(cb) {
    cb()
    return gulp.src(["main/**/*", "!main/src/**"]).pipe(gulp.dest("app"));

}


gulp.task("default", gulp.parallel(tsc, staticHandler));
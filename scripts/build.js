

const gulp = require("gulp");
const ts = require("gulp-typescript")
var uglyfly = require('gulp-uglyfly');



function tsc(cb) {
    cb()
    var tsResult = gulp.src("main/src/**/*.ts")
        .pipe(ts({}))

    return tsResult.js
        .pipe(uglyfly())
        .pipe(gulp.dest("app/dist"));

}
function staticHandler(cb) {
    cb()
    return gulp.src("main/**/*", { ignore: "src" }).pipe(gulp.dest("app"));

}


gulp.task("default", gulp.parallel(tsc, staticHandler));


const gulp = require("gulp");
const ts = require("gulp-typescript")
const uglyfly = require('gulp-uglyfly');
const fs = require('fs')

function tsc(cb) {
    cb()
    const tsResult = gulp.src("main/src/**/*.ts")
        .pipe(ts({}))

    return tsResult.js
        .pipe(uglyfly())
        .pipe(gulp.dest("app/main"));

}
function staticHandler(cb) {
    cb()
    const deps = ["main/**/*", "!main/src/**"]
    const isE = fs.existsSync('app/node_modules')
    if (isE) {
        deps.push('!main/node_modules/**')
    }
    return gulp.src(deps).pipe(gulp.dest("app"));

}


gulp.task("default", gulp.parallel(tsc, staticHandler));
var gulp = require('gulp');
var connect = require('gulp-connect'); // 起服务
var watch = require('gulp-watch'); // 监听文件
var minHtml = require('gulp-htmlmin'); // 压缩html
var scss = require('gulp-sass'); // 编译scss
var minCss = require('gulp-clean-css'); // 压缩css
var uglify = require('gulp-uglify') //压缩js
var imgmin = require('gulp-imagemin'); // 压缩图片
var clean = require('gulp-clean') // 删除文件
var sequence = require('gulp-sequence') // 执行顺序


var options = {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
};


// 编译scss 压缩css
gulp.task('Scss', function() {
    return gulp.src('src/css/*.scss', { base: 'src' })
        .pipe(scss())
        .pipe(minCss())
        .pipe(gulp.dest('dist'))
});
// 压缩css
gulp.task('MinCss', function() {
    return gulp.src('src/css/*.css', { base: 'src' })
        .pipe(minCss())
        .pipe(gulp.dest('dist'))
});
//压缩js
gulp.task('minJs', function() {
    return gulp.src('src/js/*.js', { base: 'src' })
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});
// 压缩图片
gulp.task('Image', function() {
    return gulp.src('src/img/*.jpg', { base: 'src' })
        .pipe(gulp.dest('dist'))
});
// 压缩原页面
gulp.task("htmlmin", function() {
    return gulp.src("src/*.html")
        .pipe(minHtml(options))
        .pipe(gulp.dest("dist"))
})

// 删除文件
gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean())
})

// 拷贝icon
gulp.task('Icon', function() {
        return gulp.src('src/icon/*', { base: 'src' })
            .pipe(gulp.dest('dist'))

    })
    // 自定义执行顺序
gulp.task('sequence', function(cb) {
    sequence('clean', ['Scss', 'Image', 'minJs', 'MinCss', 'htmlmin', 'watch', 'Icon'], 'httpServer', cb)
})


// 启动服务
gulp.task('httpServer', function() {
    connect.server({
        root: 'dist', // 指定文件夹映射网址
        port: 3000,
        livereload: true
    });
})

// 刷新页面
gulp.task('reloadPage', function() {
    gulp.src('.')
        .pipe(connect.reload());
})

// 更改调用刷新
gulp.task('watch', function() {
    gulp.watch('./src/index.html', ['htmlmin', 'reloadPage'])
    gulp.watch('./src/css/*.scss', ['Scss', 'reloadPage'])

})

// 默认执行
gulp.task('default', ['sequence'])
const gulp = require('gulp')
const minifycss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const cssnano = require('gulp-cssnano')
const htmlclean = require('gulp-htmlclean')
const del = require('del')
const babel = require('gulp-babel')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const pug = require('gulp-pug')
const less = require('gulp-less')

const config = require('./config.json')

gulp.task('clean', function () {
	return del(['./dist/css/', './dist/js/', './dist/i18n/', './dist/config/'])
})

gulp.task('css', function () {
	return gulp
	.src('./src/css/*.less')
	.pipe(less().on('error', function(err) {
		console.log(err);
		this.emit('end');
	}))
	.pipe(minifycss({ compatibility: 'ie8' }))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 2 version'] }))
	.pipe(cssnano({ reduceIdents: false }))
		.pipe(gulp.dest('./dist/css'))
})

gulp.task('html', function () {
	return gulp
		.src('./dist/index.html')
		.pipe(htmlclean())
		.pipe(htmlmin())
		.pipe(gulp.dest('./dist'))
})

gulp.task('js', function () {
	return gulp
		.src('./src/js/*.js')
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
})

gulp.task('pug', function () {
	return gulp
		.src('./src/index.pug')
		.pipe(pug({ data: config }))
		.pipe(gulp.dest('./dist'))
})

gulp.task('assets', function () {
	return gulp
		.src(['./src/assets/**/*'])
		.pipe(gulp.dest('./dist/assets'));
})

gulp.task('i18n', function () {
	return gulp
		.src(['./src/i18n/**/*.json'])
		.pipe(gulp.dest('./dist/i18n'));
})

gulp.task('config', function () {
	return gulp
		.src(['./src/config/**/*.json'])
		.pipe(gulp.dest('./dist/config'));
})

gulp.task('build', gulp.series('clean', 'assets', 'pug', 'css', 'js', 'i18n', 'config', 'html'))
gulp.task('default', gulp.series('build'))

gulp.task('watch', function () {
	gulp.watch('./src/components/*.pug', gulp.parallel('pug'))
	gulp.watch('./src/index.pug', gulp.parallel('pug'))
	gulp.watch('./src/css/**/*.less', gulp.parallel(['css']))
	gulp.watch('./src/js/*.js', gulp.parallel(['js']))
	gulp.watch('./src/i18n/*.json', gulp.parallel(['i18n']))
	gulp.watch('./src/config/*.json', gulp.parallel(['config']))
	connect.server({
		root: 'dist',
		livereload: true,
		port: 8080
	})
})

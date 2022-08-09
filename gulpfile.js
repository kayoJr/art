// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
	return (
		src('app/scss/style.scss', { sourcemaps: true })
			.pipe(sass())
			//postcssはautoprefixer, cssnanoなどをプラグインとして持っている
			.pipe(postcss([autoprefixer(), cssnano()]))
			// pipeされたものをファイルに書き出す
			.pipe(dest('dist', { sourcemaps: '.' }))
	);
}

// Browsersync
function browserSyncServe(cb) {
	browsersync.init({
		server: {
			// 基準とするディレクトリを指定
			baseDir: '.',
		},
		notify: false,
	});
	cb();
}
function browserSyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	// watch(監視するファイル, ファイルが更新された時に実行するタスク名)
	watch('*.html', browserSyncReload);
	// seriesは指定したものを順番に実行していく
	watch(['app/scss/**/*.scss'], series(scssTask, browserSyncReload));
}

// Default Gulp Task
exports.default = series(scssTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask);

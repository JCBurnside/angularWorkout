var gulp=require('gulp'),
	sourcemaps=require('gulp-sourcemaps'),
	concat=require('gulp-concat'),
	connect=require('gulp-connect'),
	plumber=require('gulp-plumber');

var jsFiles=[
	'app.js',
	'./components/**/*.js',
	'./services/**/*.js'
];
gulp.task('bundle',()=>{
	return gulp.src(jsFiles)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./content'));
});

gulp.task('watch',()=>{
	gulp.watch(jsFiles,['bundle']);
});

gulp.task('start-webserver',()=>{
	connect.server({root:'.'});
});

gulp.task('default',['bundle','start-webserver','watch']);
var gulp = require('gulp'),
	newer = require('gulp-newer');
	imagemin = require('gulp-imagemin');
	pngquant = require('imagemin-pngquant');
	sass = require('gulp-sass');
	cssnano = require('gulp-cssnano');
	sourcemaps = require('gulp-sourcemaps');
	rename = require('gulp-rename');
	notify = require("gulp-notify");
	bourbon = require("node-bourbon").includePaths;
	browserSync = require("browser-sync").create();
	gutil = require('gulp-util');
	csslint = require('gulp-csslint');

//UPDATE BROWSER
	// gulp.task('browserSync', function() {
	// 	browserSync.init({
	// 		//server: { baseDir: "./"}
	// 		proxy: 'vlccom.local',
	// 		socket: {
	// 	  // For external development (e.g on a mobile or tablet) use an external URL.
	// 	  // You will need to update this to whatever BS tells you is the external URL when you run Gulp.
	// 	  	//domain: 'des-gadgets.demo.hiberus.com'
	//   	}
	// 	})
	// });

//Notificando errores de CSS
function errorAlertPost(error) {
	notify.onError({
		title: 'SCSS',
		subtitle: 'Algo esta mal en tu CSS!',
		sound: 'Basso'
	})(error);
	console.log(error.toString());
	this.emit('end');
};


//Optimizando todas las imagenes en formato SVG, PNG, JPG y GIF
gulp.task('imagemin', function() {
	return gulp.src('src/images/**/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('images/'));
});

gulp.task('sass', function() {
	gulp.src("src/scss/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: bourbon
		}))
		.on('error', errorAlertPost)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest("css/"))
		.pipe(notify({
			message: 'SCSS complete'
		}))
		.pipe(browserSync.reload({stream:true}));
});


//Comprimiendo los CSS
gulp.task('mincss', function() {
	return gulp.src('css/*.css')
		.pipe(sourcemaps.init())
		.pipe(cssnano())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('css/'));
});


//Cada vez que incluyamos una nueva imagen solo esta sera optimizada por imagemin, las que ya estén optimizadas serán excluídas del proceso
var imgSrc = 'src/images/**/';
var imgDest = 'images';

// Minify any new images
gulp.task('images', function() {
	// Add the newer pipe to pass through newer images only
	return gulp.src(imgSrc)
		.pipe(newer(imgDest))
		.pipe(imagemin())
		.pipe(gulp.dest(imgDest));
});


// Validate W3C
var customReporter = function(file) {
  gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));
 
  file.csslint.results.forEach(function(result) {
    gutil.log(result.error.message+' on line '+result.error.line);
  });
};

gulp.task('css', function() {
  gulp.src('css/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter(customReporter));
});


//Watch task
gulp.task("watch", ['sass'], function() {
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/images/**/*.**', ['imagemin']);
	gulp.watch('src/images/**/*.**', ['images']);
});
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat'); // Для конкатенации css и js файлов
const rename = require('gulp-rename');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');

// Task будет брать файлы scss и трансформировать их в css
// Имя для 1 параметра пользователь придумывает сам
// Что бы указанный ниже task выполнился необходимо в терминале выполнить команду: gulp scss
gulp.task('scss', function () {
  return gulp
    .src('app/scss/**/*.scss') // Если необходимо следить за файлами с разными расширениями: (scss|sass)
    .pipe(sass({ outputStyle: 'compressed' })) // Если для ключа outputStyle будет значение compressed, то файл будет минифицирован, а если expanded, то отформатирован
    .pipe(
      autoprefixer({
        browsers: ['last 8 versions'],
      }),
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function () {
  return gulp
    .src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
      'node_modules/magnific-popup/dist/magnific-popup.css',
    ])
    .pipe(concat('_libs.scss')) // "Слепит 3 файла указанных в массиве src в _libs.scss, который подключается в файле style.scss"
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function () {
  return gulp.src('app/*.html').pipe(browserSync.reload({ stream: true }));
});

gulp.task('script', function () {
  return gulp.src('app/js/*.js').pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function () {
  return gulp
    .src([
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    ])
    .pipe(concat('libs.min.js')) // Указывается имя файла, который получится
    .pipe(uglify()) // Сжимаем файл
    .pipe(gulp.dest('app/js')) // "Выкидываем" в app/js
    .pipe(browserSync.reload({ stream: true })); // авто обновление
});

gulp.task('clean', async function () {
  del.sync('dist');
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
});

// Автоматизация
gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('html'));
  gulp.watch('app/js/*.js', gulp.parallel('script'));
});

gulp.task('export', function () {
  const buildHtml = gulp.src('app/**/*.html').pipe(gulp.dest('dist'));
  const buildCss = gulp.src('app/css/**/*.css').pipe(gulp.dest('dist/css'));
  const buildJs = gulp.src('app/js/**/*.js').pipe(gulp.dest('dist/js'));
  const buildFonts = gulp.src('app/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));
  const buildImg = gulp.src('app/img/**/*.*').pipe(gulp.dest('dist/img'));
});

gulp.task('build', gulp.series('clean', 'export'));

gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'));

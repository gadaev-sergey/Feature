import fileinclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";

export const html = () => {
  return app.gulp.src(app.path.src.html) // Найти файл html
    // Нижний pipe выводит сообщение при появлении ошибки не только в терминале, но и в самом windous
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "HTML",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(fileinclude()) // Собрать его из частей includ
    .pipe(app.plugins.replace(/@img\//g, 'img/')) // Менять @img на img/
    .pipe(
      app.plugins.if(
        app.isBuild,
        webpHtmlNosvg()// заменяет картинки кроме svg на picture с srcset на подключение того же файла с расширением .webp
      )
    )
    // Нижний pipe подставляет ключ к подключенным css и js файлам, что бы они не кешировались
    .pipe(
      app.plugins.if(
        app.isBuild,
        versionNumber({
          'value': '%DT%',
          'append': {
            'key': '_v',
            'cover': 0,
            'to': [
              'css',
              'js',
            ]
          },
          'output': {
            'file': 'gulp/version.json'
          }
        })
      )
      )
    .pipe(app.gulp.dest(app.path.build.html)) // Положить в папку с результатом
    .pipe(app.plugins.browsersync.stream()); // Обновление локального сервера
}
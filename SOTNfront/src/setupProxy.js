const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/sotn/api/**', {
      target: 'http://10.154.8.22:8088/',
      changeOrigin: true
    })
  );
  app.use(
    proxy('/sotn-check/**', {
      target: 'http://10.154.8.22:8020/',
      changeOrigin: true
    })
  );
  app.use(
    proxy('/arcgis/**', {
      target: 'http://10.154.8.22:8020/',
      changeOrigin: true
    })
  );
};

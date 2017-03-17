// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
    if (document.querySelector('#menuPage') && document.querySelector('#pendingTasksPage')) {

      $fh.cloud(
          {
            path: '/api/init',
            method: 'GET',
            data: {
                
            }
          },
          function (data) {
            data.forEach(function(d) {
              myApp.services.tasks.create(d);
            });
          },
          function (code, errorprops, params) {
            alert('An error occured: ' + code + ' : ' + errorprops);
          }
      );
    }
  }
});

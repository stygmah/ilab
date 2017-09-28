angular
  .module('app')
  .component('helloController', {
    templateUrl: 'app/hello.html',
    controller: function () {
      this.hello = 'Hello World!';
    }
  });

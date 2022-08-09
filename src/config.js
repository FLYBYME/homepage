import 'angular';



angular.module("app", [
  // minimum required dependencies
  "ui.router",
  "ui.bootstrap",
  "ui.bootstrap.modal"
]).config(function ($urlRouterProvider) {

  $urlRouterProvider.otherwise("/");
}).run(function ($rootScope, $location, $timeout, $state, RestCli) {

  $rootScope.loggedIn = () => RestCli.isAuth();
  $rootScope.role = (role) => RestCli.role(role);
  $rootScope.$on('$locationChangeSuccess', function () {
    console.log('$stateChangeSuccess')
    $timeout(function () {
      $('body').scrollTop(0);
    }, 200);

  });
})
import angular from 'angular';
import template from './app.html'

import '../style/app.css';

let app = () => {
  return {
    template: template,
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor($scope) {
    this.url = 'https://github.com/preboot/angular-webpack';
    console.log(this.url)
  }
}

const MODULE_NAME = 'app';

class Routes {
  constructor($stateProvider) {
      $stateProvider
          .state("app", {
              url: "/",
              views: {
                  main: {
                      templateUrl: "templates/Index.html",
                      controller: "Index"
                  }
              }
          })
  }
}

angular
  .module("app")
  .config(AppCtrl);
angular.module('app', [])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;
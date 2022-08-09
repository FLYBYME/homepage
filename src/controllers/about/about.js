import angular from 'angular';
import template from './about.html'


const controller = 'AboutCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
       
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/about",
            views: {
                main: {
                    template,
                    controller
                }
            }
        })
    }
}


angular.module('app')
    .config(IndexCtrl.StateProvider)
    .controller(controller, IndexCtrl);

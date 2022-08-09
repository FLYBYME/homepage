import angular from 'angular';
import template from './index.html'


const controller = 'IndexCtrl';

class IndexCtrl {
    constructor($scope) {
        this.url = 'https://github.com/preboot/angular-webpack';
        console.log(this.url)
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/",
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

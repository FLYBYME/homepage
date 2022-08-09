import angular from 'angular';
import template from './contact.html'


const controller = 'contactCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
       
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/contact",
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

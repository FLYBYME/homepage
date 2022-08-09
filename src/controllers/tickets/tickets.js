import angular from 'angular';
import template from './tickets.html'


const controller = 'ticketsCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
       
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/tickets",
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

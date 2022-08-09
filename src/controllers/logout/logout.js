import angular from 'angular';


const controller = 'LogoutCtrl';

class LoginCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        RestCli.logout()
        $state.go('IndexCtrl');
console.log(RestCli)
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/logout",
            views: {
                main: {
                    template: '',
                    controller
                }
            }
        })
    }
}


angular.module('app')
    .config(LoginCtrl.StateProvider)
    .controller(controller, LoginCtrl);

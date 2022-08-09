import angular from 'angular';
import template from './login.html'


const controller = 'LoginCtrl';

class LoginCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';

        $scope.email = null
        $scope.password = null

        $scope.submit = () => {
            console.log($scope.email, $scope.password)
            console.log(this.url)
            RestCli.login({
                email: $scope.email,
                password: $scope.password
            }).then(() => {

                $scope.email = null
                $scope.password = null
                $state.go('IndexCtrl');
            })
        }
        console.log(this.url)
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/login",
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
    .config(LoginCtrl.StateProvider)
    .controller(controller, LoginCtrl);

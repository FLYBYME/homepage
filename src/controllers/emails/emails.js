import angular from 'angular';
import template from './emails.html'


const controller = 'emailsCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
       
        $scope.update = () => {
            RestCli.get(`v1/emails?pageSize=100&sort=-createdAt`).then((emails) => {
                $scope.emails = emails

                console.log(emails)
            })
        }

        $scope.update()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/emails",
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

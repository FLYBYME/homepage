import angular from 'angular';
import template from './vpns.html'


const controller = 'vpnsCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.vpns = []
        RestCli.get('v1/vpns?populate=server').then((vpns) => {
            $scope.vpns = vpns
        })
        
        RestCli.get('v1/vpns-servers').then((servers) => {
            $scope.servers = servers
        })
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/vpns",
            views: {
                main: {
                    template,
                    controller
                }
            }
        })
    }

    attachAuthEvents() {
        this.RestCli.on('auth', () => {
            setImmediate(async () => {
                if (this.$scope) {
                    this.$scope.user = await this.RestCli.user()
                    this.$scope.profile = await this.RestCli.profile()
                    console.log('user', this.$scope.profile)
                    this.$scope.$digest()
                }
            })
        })
    }

    async loadUser() {
        if (this.$scope) {
            this.$scope.user = await this.RestCli.user()
            this.$scope.profile = await this.RestCli.profile()
            this.$scope.$digest()
        }
    }
}


angular.module('app')
    .config(IndexCtrl.StateProvider)
    .controller(controller, IndexCtrl);

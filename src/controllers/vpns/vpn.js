import angular from 'angular';
import template from './vpn.html'


const controller = 'vpnCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        this.$state = $state
        this.attachAuthEvents()
        this.loadUser()
        RestCli.get(`v1/vpns/${$state.params.id}?populate=server`).then((vpn) => {
            $scope.vpn = vpn
            console.log(vpn)
        })
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/vpns/:id",
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
                this.loadUser()
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

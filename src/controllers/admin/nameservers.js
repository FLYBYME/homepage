import angular from 'angular';
import template from './nameservers.html'


const controller = 'adminNameserversCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.nodes = []
        RestCli.get('v1/nameservers?pageSize=100').then((nameservers) => {
            console.log(nameservers)
            $scope.nameservers = nameservers
        })
        RestCli.get('v1/nodes?pageSize=100&fields=id&fields=hostname').then((nodes) => {
            console.log(nodes)
            $scope.nodes = nodes
        })

        $scope.nameserverModel = {

        }

        $scope.createNameserver = () => {


            if ($scope.nameserverModel.fqdn &&
                $scope.nameserverModel.node &&
                $scope.nameserverModel.location) {

                $scope.nameserverModel.loading = true
                const data = {
                    fqdn: $scope.nameserverModel.fqdn,
                    node: $scope.nameserverModel.node,
                    location: $scope.nameserverModel.location
                }

                RestCli.post(`v1/nameservers`, data).then((nameserver) => {
                    $state.go("adminNameserverCtrl", { id: nameserver.id });
                })
            }

        }

        $scope.reset = () => {
            $scope.nameserverModel = {

            }
            $scope.$digest()
        }
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/nameservers",
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

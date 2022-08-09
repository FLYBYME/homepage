import angular from 'angular';
import template from './balancers.html'


const controller = 'adminBalancersCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope




        $scope.nodes = []
        RestCli.get('v1/balancers?pageSize=100').then((balancers) => {
            $scope.balancers = balancers
        })
        RestCli.get('v1/balancers/address').then((address) => {
            console.log(address)
            $scope.address = address
        })
        RestCli.get('v1/nodes?pageSize=100&fields=id&fields=hostname').then((nodes) => {
            $scope.nodes = nodes
        })

        $scope.balancerModel = {

        }

        $scope.createBalancer = () => {


            if ($scope.balancerModel.node &&
                $scope.balancerModel.location) {

                $scope.balancerModel.loading = true



                const data = {
                    fqdn: Array.from($scope.nodes.rows).find((node) => node.id == $scope.balancerModel.node).hostname,
                    node: $scope.balancerModel.node,
                    location: $scope.balancerModel.location
                }

                RestCli.post(`v1/balancers`, data).then((nameserver) => {
                    $state.go("adminBalancerCtrl", { id: nameserver.id });
                })
            }

        }

        $scope.reset = () => {
            $scope.balancerModel = {

            }
            $scope.$digest()
        }
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/balancers",
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

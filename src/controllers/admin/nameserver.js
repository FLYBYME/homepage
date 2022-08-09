import angular from 'angular';
import template from './nameserver.html'


const controller = 'adminNameserverCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        this.$state = $state
        this.attachAuthEvents()
        this.loadUser()
        $scope.interfaceModel = {}

        $scope.reset = () => {
            $scope.interfaceModel = {}
        }
        $scope.removeInterface = (address) => {

            RestCli.delete(`v1/nameservers/${$state.params.id}/address/${address.id}`).then((disk) => {
                $scope.reset()
                $scope.update()
            })

        }
        $scope.createInterface = () => {


            if ($scope.interfaceModel.interface) {

                $scope.interfaceModel.loading = true
                const data = {
                    node: $scope.nameserver.node.id,
                    interface: $scope.interfaceModel.interface
                }
                console.log(data)
                RestCli.post(`v1/nameservers/${$state.params.id}/address`, data).then((disk) => {
                    $scope.reset()
                    $scope.update()
                })
            }

        }
        $scope.update = () => {
            RestCli.get(`v1/nameservers/${$state.params.id}?populate=node`).then((nameserver) => {
                console.log(nameserver)
                $scope.nameserver = nameserver

                RestCli.get(`v1/nodes/${nameserver.node.id}/networks`).then((networks) => {
                    console.log(networks)
                    $scope.networks = networks
                })
            })
            RestCli.get(`v1/nameservers/${$state.params.id}/address?populate=interface`).then((address) => {
                console.log(address)
                $scope.address = address
            })
        }

        $scope.update()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/nameservers/:id",
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

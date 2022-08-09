import angular from 'angular';
import template from './container.html'


const controller = 'adminContainerCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope
        this.$state = $state
        this.attachAuthEvents()
        this.loadUser()
        $scope.interfaceModel = {}

        $scope.reset = () => {
            $scope.interfaceModel = {}
        }

        $scope.update = () => {
            RestCli.get(`v1/containers/${$state.params.id}?populate=envs&populate=ports&populate=state`).then((container) => {
                console.log(container)
                $scope.container = container
            })
        }

        $scope.update()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/containers/:id",
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

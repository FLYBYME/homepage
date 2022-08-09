import angular from 'angular';
import template from './nodes.html'


const controller = 'adminNodesCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.nodes = []
        RestCli.get('v1/nodes?pageSize=100').then((nodes) => {
            console.log(nodes)
            $scope.nodes = nodes
        })

        $scope.spaceModel = {

        }

        $scope.openNodeTerm = (node) => {
            console.log(node)
            window.open(`https://console.one-host.ca/terminal.html#${node.nodeID}/${RestCli.token}`, '_blank', 'location=yes,height=800,width=1000,scrollbars=no,status=yes')
        }
        $scope.createSpace = () => {


            if ($scope.spaceModel.name &&
                $scope.spaceModel.description &&
                $scope.spaceModel.domain) {

                $scope.spaceModel.loading = true
                const data = {
                    name: $scope.spaceModel.name,
                    description: $scope.spaceModel.description,
                    domain: $scope.spaceModel.domain
                }

                RestCli.post(`v1/spaces`, data).then((space) => {
                    $state.go("spaceCtrl", { id: space.id });
                })
            }

        }

        $scope.reset = () => {
            $scope.spaceModel = {

            }
            $scope.$digest()
        }
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/nodes",
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

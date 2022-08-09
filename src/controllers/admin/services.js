import angular from 'angular';
import template from './services.html'


const controller = 'adminServicesCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope

        $scope.groups = [];

        $scope.update = () => {

            RestCli.get('v1/services?pageSize=100&sort=nodeID&sort=service').then((services) => {
                const groups = [];
                for (let index = 0; index < services.rows.length; index++) {
                    const service = services.rows[index];
                    let index = groups.findIndex((s) => {
                        return s.service == service.service;
                    });
                    if (index == -1) {
                        index = groups.push({
                            service: service.service,
                            version: service.version,
                            path: service.path,
                            nodes: []
                        }) - 1;
                    }
                    groups[index].nodes.push(service)
                }
                $scope.services = services
                console.log(groups)
            })
            RestCli.get('v1/nodes?pageSize=100').then((nodes) => {
                $scope.nodes = nodes
                console.log(nodes)
            })
        }

        $scope.serviceModel = {
            version: 1
        }

        $scope.createService = () => {
            const model = $scope.serviceModel

            if (model.service &&
                model.path &&
                model.nodeID) {

                model.loading = true

                const data = {
                    nodeID: model.nodeID,
                    service: model.service,
                    version: model.version,
                    path: model.path,
                }

                RestCli.post(`v1/services/`, data).then(() => {
                    model.loading = false
                    $scope.update()
                })
            }

        }
        $scope.copyService = (service) => {
            $scope.serviceModel.service = service.service
            $scope.serviceModel.version = service.version
            $scope.serviceModel.path = service.path
        }
        $scope.removeService = (service) => {
            RestCli.delete(`v1/services/${service.id}`).then(() => {
                $scope.update()
            })
        }
        $scope.startService = (service) => {
            RestCli.post(`v1/services/${service.id}/start`, {}).then(() => {
                $scope.update()
            })
        }
        $scope.stopService = (service) => {
            RestCli.post(`v1/services/${service.id}/stop`, {}).then(() => {
                $scope.update()
            })
        }
        $scope.reloadService = (service) => {
            RestCli.post(`v1/services/${service.id}/reload`, {}).then(() => {
                $scope.update()
            })
        }
        $scope.reset = () => {
            $scope.serviceModel = {
                version: 1
            }
            $scope.$digest()
        }
        $scope.update()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/services",
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

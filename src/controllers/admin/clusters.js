import angular from 'angular';
import template from './clusters.html'


const controller = 'adminClustersCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope




        $scope.nodes = [];
        $scope.update = () => {

            RestCli.get('v1/clusters?pageSize=100&populate=storage&populate=domains&populate=compute&populate=gateways&populate=region').then((clusters) => {
                $scope.clusters = clusters
                console.log(clusters)
            })
            RestCli.get('v1/nodes?pageSize=100').then((nodes) => {
                $scope.nodes = nodes
                console.log(nodes)
            })
            RestCli.get('v1/nodes/disks?pageSize=100').then((disks) => {
                $scope.disks = disks
                console.log(disks)
            })
            RestCli.get('v1/nodes/mounts?pageSize=100').then((mounts) => {
                $scope.mounts = mounts
                console.log(mounts)
            })
        }

        $scope.clusterComputeModel = {

        }

        $scope.createClusterCompute = () => {
            const model = $scope.clusterComputeModel

            if (model.node &&
                model.cluster) {

                model.loading = true

                const node = $scope.nodes.rows.find((node) => node.id == model.node)

                const data = {
                    node: model.node,
                    cluster: model.cluster,
                    cores: node.cpu.cores,
                    memory: node.memory.total
                }

                RestCli.post(`v1/clusters/${model.cluster}/computes`, data).then(() => {
                    model.loading = false
                    $scope.update()
                })
            }

        }
        $scope.createClusterStorage = () => {
            const model = $scope.clusterStorageModel

            if (model.mount &&
                model.cluster) {

                model.loading = true

                const data = {
                    mount: model.mount,
                    cluster: model.cluster
                }

                RestCli.post(`v1/clusters/${model.cluster}/storages`, data).then(() => {
                    model.loading = false
                    $scope.update()
                })
            }

        }

        $scope.reset = () => {
            $scope.clusterComputeModel = {

            }
            $scope.$digest()
        }
        $scope.update()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/clusters",
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

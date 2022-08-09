import angular from 'angular';
import template from './containers.html'


const controller = 'adminContainersCtrl';

class IndexCtrl {
    constructor($scope, $state, $interval, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope

        $scope.updateStats = () => {
            for (let index = 0; index < $scope.containers.rows.length; index++) {
                const container = $scope.containers.rows[index];
                if (container.status == 'running') {
                    const key = [
                        `${container.node.hostname}.docker.${container.name}.cpu_stats.cpu_usage.percent`,
                        `${container.node.hostname}.docker.${container.name}.memory_stats.percent`
                    ]
                    RestCli.post('v1/stats/query', {
                        key,
                        merge: true
                    }).then(async (stats) => {

                        const [cpu, memory] = key


                        container.cpu = stats[cpu]
                        container.memory = stats[memory]
                    })
                }
            }
        }
        $scope.update = () => {

            RestCli.get('v1/containers?pageSize=100&sort=status&sort=node&sort=name&populate=node').then(async (containers) => {
                $scope.containers = containers
                $scope.updateStats()

            })
        }


        this.interval = $interval(() => $scope.update(), 5000);
        $scope.$on('$destroy', () => {
            $interval.cancel(this.interval);
        });
        $scope.nodes = []

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

        $scope.restart = (container) => {
            RestCli.post(`v1/containers/${container.id}/restart`, {})
        }
        $scope.stop = (container) => {
            RestCli.post(`v1/containers/${container.id}/stop`, {})
        }
        $scope.start = (container) => {
            RestCli.post(`v1/containers/${container.id}/start`, {})
        }
        $scope.remove = (container) => {
            RestCli.post(`v1/containers/${container.id}/remove`, {})
        }
        $scope.reset = () => {
            $scope.balancerModel = {

            }
            $scope.$digest()
        }

        $scope.update()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/containers",
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

import angular from 'angular';
import template from './node.html'


const controller = 'adminNodeCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        this.$state = $state
        this.attachAuthEvents()
        this.loadUser()

        $scope.mountModel = {

        }
        $scope.diskModel = {

        }


        $scope.createDisk = () => {


            if ($scope.diskModel.path &&
                $scope.diskModel.size &&
                $scope.diskModel.device &&
                $scope.diskModel.type) {

                $scope.diskModel.loading = true
                const data = {
                    path: $scope.diskModel.path,
                    size: $scope.diskModel.size,
                    device: $scope.diskModel.device,
                    type: $scope.diskModel.type
                }
                console.log(data)
                RestCli.post(`v1/nodes/${$state.params.id}/disks`, data).then((disk) => {
                    $scope.reset()
                    $scope.update()
                })
            }

        }


        $scope.removeMount = (mount) => {
            RestCli.delete(`v1/nodes/${$state.params.id}/mounts/${mount.id}`).then((disk) => {
                $scope.reset()
                $scope.update()
            })
        }


        $scope.createMount = () => {


            if ($scope.mountModel.mountpoint &&
                $scope.mountModel.device &&
                $scope.mountModel.type) {

                $scope.mountModel.loading = true
                const data = {
                    mountpoint: $scope.mountModel.mountpoint,
                    device: $scope.mountModel.device,
                    type: $scope.mountModel.type
                }
                console.log(data)
                RestCli.post(`v1/nodes/${$state.params.id}/mounts`, data).then((mount) => {
                    $scope.reset()
                    $scope.update()
                })
            }

        }

        $scope.reset = () => {
            $scope.diskModel = {

            }
            $scope.mountModel = {

            }
        }


        $scope.updateSpace = () => {
            RestCli.post(`v1/spaces/${$state.params.id}/websites`, {
                name: $scope.websiteModel.name,
                size: $scope.websiteModel.size,
                template: $scope.websiteModel.template,
                route: $scope.websiteModel.route
            }).then(() => {
                $scope.update()
            })
        }


        $scope.updateStats = () => {
            RestCli.post(`v1/stats/query`, {
                key: `maas-*.proc.cpu.*.percentage`,
                merge: false
            }).then((cpus) => {
                $scope.cpus = Object.keys(cpus).map((key) => cpus[key])
            })
            RestCli.post(`v1/stats/query`, {
                key: [
                    `maas-2280891.proc.memory.memTotal`,
                    `maas-2280891.proc.memory.memAvailable`,
                    `maas-2280891.proc.memory.memFree`,
                    `maas-2280891.proc.memory.buffers`,
                    `maas-2280891.proc.memory.cached`
                ],
                merge: false
            }).then((memory) => {
                console.log(memory)
                $scope.memory = {

                }

                Object.keys(memory).forEach((_key) => {
                    const key = _key.split('.').pop()
                    console.log(key, _key)
                    $scope.memory[key] = memory[_key][_key]
                })
                $scope.memory['memUsed'] = $scope.memory.memTotal - $scope.memory.memFree
                console.log('memory', $scope.memory)

            })
        }
        $scope.update = () => {
            RestCli.get(`v1/nodes/${$state.params.id}`).then((node) => {
                console.log(node)
                $scope.node = node
            })
            RestCli.get(`v1/nodes/${$state.params.id}/mounts`).then((mounts) => {
                console.log(mounts)
                $scope.mounts = mounts
            })
            RestCli.get(`v1/nodes/${$state.params.id}/disks`).then((disks) => {
                console.log(disks)
                $scope.disks = disks
            })
            RestCli.get(`v1/nodes/${$state.params.id}/networks?pageSize=100`).then((res) => {
                console.log(res)
                const networks = {
                    public: [],
                    internal: [],
                    tunnel: [],
                    docker: []
                }
                for (let index = 0; index < res.rows.length; index++) {
                    const network = res.rows[index];
                    if (network.public) {
                        networks.public.push(network)
                    } else if (network.internal) {
                        networks.internal.push(network)
                    } else if (network.tunnel) {
                        networks.tunnel.push(network)
                    } else if (network.docker) {
                        networks.docker.push(network)
                    }
                }
                $scope.networks = networks
            })
        }

        $scope.update()
        $scope.updateStats()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/nodes/:id",
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

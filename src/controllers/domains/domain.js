import angular from 'angular';
import template from './domain.html'


const controller = 'domainCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope
        // $scope.domain = {}
        $scope.domainModel = {
            type: 'A',
            ttl: 99
        }
        $scope.reset = () => {
            $scope.domainModel = {
                type: 'A',
                ttl: 99
            }
        }
        $scope.update = () => {
            RestCli.get(`v1/domains/${$state.params.id}`).then((domain) => {
                $scope.domain = domain

                RestCli.get(`v1/domains/${$state.params.id}/records?pageSize=100&sort=type&sort=fqdn`).then((records) => {
                    $scope.records = records
                    console.log(records)
                })
                console.log(domain)
            })
        }
        $scope.createRecord = () => {
            console.log($scope.domainModel)
            $scope.domainModel.fqdn = $scope.domainModel.fqdn ? `${$scope.domainModel.fqdn}.${$scope.domain.domain}` : $scope.domain.domain
            RestCli.post(`v1/domains/${$state.params.id}/records`, $scope.domainModel).then(() => {
                $scope.reset()
                $scope.update()
            })
        }
        $scope.removeRecord = (record) => {
            console.log(record)

            RestCli.delete(`v1/domains/${$state.params.id}/records/${record.id}`).then(() => {
                $scope.reset()
                $scope.update()
            })
        }
        $scope.updateDomain = () => {
            RestCli.patch(`v1/domains/${$state.params.id}`, {
                name: $scope.domain.name
            }).then(() => {
                $scope.update()
            })
        }
        $scope.records = []
        $scope.update()
    }




    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/domains/:id",
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

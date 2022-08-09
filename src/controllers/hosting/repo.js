import angular from 'angular';
import template from './repo.html'


const controller = 'repoCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
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
            RestCli.get(`v1/repos/${$state.params.id}`).then((repo) => {
                $scope.repo = repo

                RestCli.get(`v1/repos/${$state.params.id}/commits?sort=-createdAt`).then((commits) => {
                    $scope.commits = commits
                    console.log(commits.totalPages)
                })
                console.log(repo)
            })
        }
        $scope.createRecord = () => {
            console.log($scope.domainModel)
            $scope.domainModel.fqdn = `${$scope.domainModel.fqdn}.${$scope.domain.domain}`
            RestCli.post(`v1/domains/${$state.params.id}/records`, $scope.domainModel).then(() => {
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
            url: "/repos/:id",
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

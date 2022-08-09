import angular from 'angular';
import template from './repos.html'


const controller = 'reposCtrl';

class IndexCtrl {
    constructor($scope, $interval, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.repos = []
        $scope.domainModel = {
            defaults: true
        }

        $scope.reset = () => {
            delete $scope.domainModel.domain
            $scope.domainModel.defaults = true
            $scope.$digest()
        }


        $scope.stats = {
            querysTotal: 0,
            querys: 0
        }
        RestCli.get('v1/repos').then((repos) => {
            $scope.repos = repos
           // this.updateStats($scope, RestCli)
        })



    }

    async updateStats($scope, RestCli) {
        RestCli.get(`v1/stats/stats`).then((res) => {
            $scope.stats.querysTotal = res.dns_querys_total
            $scope.stats.querys = res.dns_querys
            console.log(res)

        })
    }

    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/repos",
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

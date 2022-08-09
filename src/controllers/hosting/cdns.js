import angular from 'angular';
import template from './cdns.html'


const controller = 'cdnsCtrl';

class IndexCtrl {
    constructor($scope,$state, $interval, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.cdns = []
        $scope.cdnModel = { branch: 'master' }

        $scope.reset = () => {
            $scope.cdnModel = { branch: 'master' }
            $scope.$digest()
        }


        $scope.stats = {
            querysTotal: 0,
            querys: 0
        }
        RestCli.get('v1/cdns?populate=repo').then((cdns) => {
            $scope.cdns = cdns

        })
        RestCli.get('v1/repos').then((repos) => {
            $scope.repos = repos
            console.log(repos)
        })

        $scope.create = async (model) => {
            if (model.route &&
                model.description &&
                model.branch &&
                model.repo) {
                if (model.repo == 'NEW') {
                    if (!model.repoName) {
                        return;
                    }
                    model.repo = await RestCli.post('v1/repos', { name: model.repoName }).then((res) => res.id)
                }

                const cdn = await RestCli.post('v1/cdns', {
                    vHost: model.route,
                    repo: model.repo,
                    branch: model.branch
                })
                $state.go("cdnCtrl", { id: cdn.id });
            }
        }

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
            url: "/cdns",
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

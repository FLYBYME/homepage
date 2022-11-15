import angular from 'angular';
import template from './domains.html'


const controller = 'domainsCtrl';

class IndexCtrl {
    constructor($scope, $interval, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.domains = []
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
        RestCli.get('v1/domains').then((domains) => {
            $scope.domains = domains
            this.updateStats($scope, RestCli)
        })



        this.interval = $interval(() => {
            this.updateStats($scope, RestCli)
        }, 10 * 1000);
        $scope.$on('$destroy', () => {
            $interval.cancel(this.interval);
        });
    }

    async updateStats($scope, RestCli) {
        RestCli.get(`v1/domains/stats`).then((res) => {
            let querysTotal = 0;
            let querys = 0;
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                if (element.status == 'fulfilled') {
                    querys += element.info.querys;
                    querysTotal += element.info.querysTotal;
                }
            }
            $scope.stats.querysTotal = querysTotal;
            $scope.stats.querys = querys;
        })
    }

    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/domains",
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

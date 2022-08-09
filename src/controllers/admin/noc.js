import angular from 'angular';
import template from './noc.html'


const controller = 'adminNOCCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope

        $scope.update = () => {
            RestCli.get(`v1/noc/networks?pageSize=100&sort=name`).then((networks) => {
                console.log(networks)
                $scope.networks = networks;
            })
            RestCli.get(`v1/noc/asns?pageSize=100&sort=name`).then((asns) => {
                console.log(asns)
                $scope.asns = asns;
            })
            RestCli.get(`v1/noc/hosts?pageSize=100&sort=score&populate=network`).then((hosts) => {
                console.log('hosts', hosts)
                $scope.hosts = hosts;
            })
            RestCli.get(`v1/noc/incidents?pageSize=100&populate=host`).then((incidents) => {
                console.log('incidents', incidents)
                $scope.incidents = incidents;
            })
            RestCli.get(`v1/noc/firewall/rules?pageSize=100&populate=node&sort=jump`).then((rules) => {
                console.log('rules', rules)
                $scope.rules = rules;
            })
        }

        $scope.update()
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/noc",
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

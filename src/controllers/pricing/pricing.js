import angular from 'angular';
import template from './pricing.html'


const controller = 'pricingCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.groups = {}
        RestCli.get('v1/faqs').then((faqs) => {
            const keys = []
            for (let index = 0; index < faqs.rows.length; index++) {
                const entity = faqs.rows[index];
                if (!$scope.groups[entity.group]) {
                    $scope.groups[entity.group] = []
                    $scope.groups[entity.group].group=entity.group
                    keys.push(entity.group)
                }
                $scope.groups[entity.group].push(entity)
            }
        })
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/pricing",
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

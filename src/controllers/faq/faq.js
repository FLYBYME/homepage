import angular from 'angular';
import template from './faq.html'


const controller = 'faqCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.mainGroup = {}
        $scope.groups = []
        RestCli.get('v1/faqs').then((faqs) => {
            const keys = []
            const groups = {}
            for (let index = 0; index < faqs.rows.length; index++) {
                const entity = faqs.rows[index];
                if (!groups[entity.group]) {
                    groups[entity.group] = []
                    keys.push(entity.group)
                }
                groups[entity.group].push(entity)
            }
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                groups[key].group=key;
                console.log(key == 'Basic Questions')
               
                    $scope.groups.push(groups[key])
                
            }
            console.log('$scope.mainGroup',$scope.mainGroup)
        })
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/faq",
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

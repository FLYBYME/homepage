import angular from 'angular';
import template from './namespaces.html'


const controller = 'namespacesCtrl';
class NamespacesCtrl {

    constructor($scope, $interval, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope


        this.title = 'Name Spaces';





        this.intervals($scope, $interval, RestCli)
        this.attach($scope, $interval, RestCli)
    }

    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/namespaces",
            views: {
                main: {
                    template,
                    controller
                }
            }
        })
    }



    intervals($scope, $interval, RestCli) {
        this.interval = $interval(() => {

        }, 10 * 1000);
        $scope.$on('$destroy', () => {
            $interval.cancel(this.interval);
        });
    }

    attach($scope, $interval, RestCli) {
        $scope.ctl = this;
        $scope.RestCli = RestCli;
        $scope.title = this.title;


        $scope.resourcequotas = []
        $scope.model = {
            name: null,
            resourcequota: null,
            description: null
        }


        this.loadresourcequota($scope, $interval, RestCli)
        this.loadnamespaces($scope, $interval, RestCli)


        $scope.submitNewNamespace = () => {
            this.submitNewNamespace()
        }
        $scope.resetNewNamespace = () => {
            this.resetNewNamespace()
        }

    }
    loadresourcequota($scope, $interval, RestCli) {
        RestCli.get(`v1/resourcequotas`, { sort: 'name' }).then((res) => {
            console.log(res)
            $scope.resourcequotas = res;
        })
    }
    loadnamespaces($scope, $interval, RestCli) {
        RestCli.get(`v1/namespaces`, { sort: 'name' }).then((res) => {
            console.log(res)
            $scope.namespaces = res;
        })
    }

    submitNewNamespace() {

    }
    submitNewNamespace() {

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


}


angular.module('app')
    .config(NamespacesCtrl.StateProvider)
    .controller(controller, NamespacesCtrl);

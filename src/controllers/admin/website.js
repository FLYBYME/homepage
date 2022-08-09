import angular from 'angular';
import template from './website.html'


const controller = 'websiteCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        this.$state = $state
        this.attachAuthEvents()
        this.loadUser()
        $scope.startSite = () => {
            RestCli.post(`v1/spaces/${$state.params.space}/websites/${$state.params.id}/start`, {

            }).then((constainer) => {
                console.log(constainer)
                $scope.update()
            })
        }
        $scope.stopSite = () => {
            RestCli.post(`v1/spaces/${$state.params.space}/websites/${$state.params.id}/stop`, {

            }).then((constainer) => {
                console.log(constainer)
                $scope.update()
            })
        }
        $scope.updateStats = () => {
            RestCli.post(`v1/stats/query`, {
                key: `*.${$scope.website.route.vHost}.hitsTotal`,
                merge: true
            }).then((hitsTotal) => {
                $scope.hitsTotal = hitsTotal
            })
            RestCli.post(`v1/stats/query`, {
                key: `*.${$scope.website.route.vHost}.hits`,
                merge: true
            }).then((hits) => {
                $scope.hits = hits
            })
            
            this.$scope.$digest()
        }
        $scope.update = () => {
            RestCli.get(`v1/spaces/${$state.params.space}/websites/${$state.params.id}?populate=route&populate=size&populate=template`).then((website) => {
                console.log(website)
                $scope.website = website

                $scope.updateStats()
            })
        }



        RestCli.get(`v1/spaces/${$state.params.space}?populate=domain&populate=websites&populate=mysqls`).then((space) => {
            console.log(space)
            $scope.space = space
        })

        $scope.update();

    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/spaces/:space/websites/:id",
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

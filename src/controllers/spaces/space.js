import angular from 'angular';
import template from './space.html'


const controller = 'spaceCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        this.$state = $state
        this.attachAuthEvents()
        this.loadUser()

        RestCli.get('v1/sizes?pageSize=100&sort=name').then((sizes) => {
            console.log(sizes)
            $scope.sizes = sizes
        })


        $scope.websiteModel = {

        }

        $scope.createWebsite = () => {


            if ($scope.websiteModel.name &&
                $scope.websiteModel.size &&
                $scope.websiteModel.template) {

                $scope.websiteModel.loading = true
                const data = {
                    name: $scope.websiteModel.name,
                    size: $scope.websiteModel.size,
                    template: $scope.websiteModel.template,
                    route: $scope.websiteModel.route ?
                        `${$scope.websiteModel.route}.${$scope.space.domain.domain}` :
                        $scope.space.domain.domain
                }

                RestCli.post(`v1/spaces/${$state.params.id}/websites`, data).then((website) => {
                    $state.go("websiteCtrl", { "space": $state.params.id, id: website.id });
                })
            }

        }

        $scope.reset = () => {
            $scope.websiteModel = {

            }
            $scope.$digest()
        }


        $scope.updateSpace = () => {
            RestCli.post(`v1/spaces/${$state.params.id}/websites`, {
                name: $scope.websiteModel.name,
                size: $scope.websiteModel.size,
                template: $scope.websiteModel.template,
                route: $scope.websiteModel.route
            }).then(() => {
                $scope.update()
            })

        }


        $scope.updateStats = () => {
            RestCli.post(`v1/stats/query`, {
                key: `*.${$scope.space.domain.domain}.hitsTotal`,
                merge: true
            }).then((hitsTotal) => {
                $scope.hitsTotal = hitsTotal
            })
            RestCli.post(`v1/stats/query`, {
                key: `*.${$scope.space.domain.domain}.hits`,
                merge: true
            }).then((hits) => {
                $scope.hits = hits
            })
        }
        $scope.update = () => {
            RestCli.get(`v1/spaces/${$state.params.id}?populate=domain&populate=websites&populate=mysqls`).then((space) => {
                $scope.space = space
                $scope.updateStats()
            })

            RestCli.get(`v1/spaces/${$state.params.id}/websites?populate=size&populate=template&populate=route`).then((websites) => {
                $scope.websites = websites
            })
        }

        $scope.removeWebsite = (website) => {
            RestCli.delete(`v1/spaces/${$state.params.id}/websites/${website.id}`).then((space) => {
                $scope.update()
            })
        }
        $scope.update()

        RestCli.get(`v1/spaces/${$state.params.id}/mysqls?populate=size&populate=account&populate=route`).then((mysqls) => {
            $scope.mysqls = mysqls
        })
        RestCli.get(`v1/templates`).then((templates) => {
            $scope.templates = templates
        })
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/spaces/:id",
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

import angular from 'angular';
import template from './spaces.html'


const controller = 'spacesCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        this.$scope = $scope
        $scope.spaces = []
        RestCli.get('v1/spaces?populate=domain&populate=websites&populate=mysqls').then((spaces) => {
            console.log(spaces)
            $scope.spaces = spaces
        })

        $scope.spaceModel = {

        }

        $scope.createSpace = () => {


            if ($scope.spaceModel.name &&
                $scope.spaceModel.description &&
                $scope.spaceModel.domain) {

                $scope.spaceModel.loading = true
                const data = {
                    name: $scope.spaceModel.name,
                    description: $scope.spaceModel.description,
                    domain: $scope.spaceModel.domain
                }

                RestCli.post(`v1/spaces`, data).then((space) => {
                    $state.go("spaceCtrl", { id: space.id });
                })
            }

        }


        $scope.reset = () => {
            $scope.spaceModel = {

            }
            $scope.$digest()
        }
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/spaces",
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

import angular from 'angular';
import template from './header.html'


const controller = 'headerDirective';

class TopnavDirective {
    constructor(RestCli) {
        this.RestCli = RestCli;
        this.restrict = 'E'
        this.template = template
        this.scope = {}
        this.attachAuthEvents()
    }

    controller($scope, $document) {
        this.$scope = $scope
        this.$document = $document
        this.$scope.isAuth = () => this.RestCli.isAuth()
        $scope.$on('$destroy', () => {
            this.$scope = null
        });
        $scope.toggleSidebar = () => {
            var element = document.querySelector("body");
            element.classList.toggle("toggle-sidebar");
        }
    }

    link(scope, element, attrs) {
        
    }


    attachAuthEvents() {
        this.RestCli.on('auth', () => {
            setImmediate(() => {
                if (this.$scope) {

                    this.RestCli.user().then((user) => {
                        this.$scope.user = user
                        this.RestCli.profile().then((profile) => {
                            this.$scope.profile = profile
                            this.$scope.$digest()
                        })
                    })
                }
            })
        })
    }

}


angular.module('app')
    .directive(controller, (RestCli) => {
        const driective = new TopnavDirective(RestCli)

        return {
            restrict: 'E',
            template,
            controller: ($scope, $document) => driective.controller($scope, $document),
            link: (scope, element, attrs) => driective.link(scope, element, attrs)
        }
    });

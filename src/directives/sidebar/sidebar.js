import angular from 'angular';
import template from './sidebar.html'


const controller = 'sidebarDirective';

class TopnavDirective {
    constructor(RestCli) {
        this.RestCli = RestCli;
        this.restrict = 'E'
        this.template = template
        this.scope = {}
        this.attachAuthEvents()
    }

    controller($scope) {
        this.$scope = $scope
        this.$scope.isAuth = () => this.RestCli.isAuth()
        $scope.$on('$destroy', () => {
            this.$scope = null
        });
    }

    link(scope, element, attrs) {
        
    }


    attachAuthEvents() {
        this.RestCli.on('auth', () => {
            setImmediate(() => {
                if (this.$scope)
                    this.$scope.$digest()
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
            controller: ($scope) => driective.controller($scope),
            link: (scope, element, attrs) => driective.link(scope, element, attrs)
        }
    });

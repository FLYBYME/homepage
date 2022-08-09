import angular from 'angular';
import template from './faq-group-1.html'


const controller = 'faqGroupOneDirective';

class TopnavDirective {
    constructor(RestCli) {
        this.RestCli = RestCli;
        this.restrict = 'E'
        this.template = template
        this.scope = {
            scopeGroup: '=group'
        }
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
        console.log('group', scope)
    }


    attachAuthEvents() {
        this.RestCli.on('auth', () => {
            setImmediate(() => {
                console.log('auth', this.RestCli.isAuth())
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
            controller: driective.controller.bind(driective),
            link: (scope, element, attrs) => driective.link(scope, element, attrs)
        }
    });

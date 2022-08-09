import angular from 'angular';



const controller = 'bytesToSize';

class minutesAgo {
    constructor(RestCli, $compile, $interval) {
        this.RestCli = RestCli;
        this.$compile = $compile;
        this.$interval = $interval;

        this.restrict = 'EA';
        this.replace = true

        this.scope = {
            bytes: "="
        }

        this.template = "<span>{{size}}</span>";
    }

    controller($scope) {
        this.$scope = $scope

    }

    link(scope, element, attrs) {

        scope.size = this.bytesToSize(scope.bytes)

    }
    bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        if (bytes == undefined) return '? Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

}


angular.module('app')
    .directive(controller, ($compile, $interval, RestCli) => {
        const driective = new minutesAgo(RestCli, $compile, $interval,)
        return {
            replace: driective.replace,
            restrict: driective.restrict,
            scope: driective.scope,
            template: driective.template,
            controller: ($scope) => driective.controller($scope),
            link: (scope, element, attrs) => driective.link(scope, element, attrs)
        }
    });

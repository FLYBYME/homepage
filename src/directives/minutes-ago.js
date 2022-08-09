import angular from 'angular';



const controller = 'minutesAgo';

class minutesAgo {
    constructor(RestCli, $compile, $interval) {
        this.RestCli = RestCli;
        this.$compile = $compile;
        this.$interval = $interval;

        this.restrict = 'EA';
        this.replace = true

        this.scope = {
            startTime: "="
        }

        this.template = "<span>{{pluralizedMinutes}} ago</span>";
        this.SECOND = 1000;
        this.MINUTE = this.SECOND * 60;
        this.HOURS = this.MINUTE * 60;
        this.DAYS = this.HOURS * 24;

        this.attachAuthEvents();
    }

    controller($scope) {
        this.$scope = $scope
        this.attachScope($scope)
        this.attachEventsScope($scope)




    }

    link(scope, element, attrs) {
        
        this.updateMinutes(scope, Date.now() - new Date(scope.startTime));
        this.interval = this.$interval(() => {

            let millsAgo = Date.now() - new Date(scope.startTime);
            if (millsAgo >= this.MINUTE && millsAgo <= this.HOURS) {
                this.$interval.cancel(this.interval);
                this.interval = this.$interval(() => {
                    this.updateMinutes(scope, Date.now() - new Date(scope.startTime));
                }, this.MINUTE);
            }
            this.updateMinutes(scope, millsAgo);
        }, this.SECOND);
        scope.$on('$destroy', () => {
            this.$interval.cancel(this.interval);
        });
    }
    update() {

    }

    attachEventsScope() {
        const { $scope } = this;
        $scope.$on('$destroy', () => {
            this.$scope = null
        });

    }


    attachScope($scope) {
        $scope.login = () => this.login();
        $scope.loggedIn = () => this.loggedIn();
        $scope.logout = () => this.logout();
        $scope.clearError = () => this.clearError();

    }

    attachAuthEvents() {
        this.RestCli.on('auth', () => {
            setImmediate(() => {
                this.update()
                if (this.$scope)
                    this.$scope.$digest()
            })
        })
    }

    loggedIn() {
        return this.RestCli.isAuth()
    }
    clearError() {
        const $scope = this.$scope
        $scope.errorMessage = null
        $scope.error = false
    }
    updateMinutes(scope, millsAgo) {
        if (millsAgo >= this.DAYS) {

            scope.timeAgo = Math.floor(millsAgo / this.DAYS);
            scope.pluralizedMinutes = scope.timeAgo + " d"
        } else if (millsAgo >= this.HOURS) {

            scope.timeAgo = Math.floor(millsAgo / this.HOURS);
            scope.pluralizedMinutes = scope.timeAgo + " h"
        } else if (millsAgo >= this.MINUTE) {

            scope.timeAgo = Math.floor(millsAgo / this.MINUTE);
            scope.pluralizedMinutes = scope.timeAgo + " m"
        } else {
            scope.timeAgo = Math.floor(millsAgo / this.SECOND);
            scope.pluralizedMinutes = scope.timeAgo + " s"
        }
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

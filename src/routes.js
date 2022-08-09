

class Routes {
    constructor($stateProvider) {
        $stateProvider
            .state("index", {
                url: "/",
                views: {
                    main: {
                        templateUrl: "templates/Index.html",
                        controller: "Index"
                    }
                }
            })
    }
}

angular
    .module("app")
    .config(AppCtrl);

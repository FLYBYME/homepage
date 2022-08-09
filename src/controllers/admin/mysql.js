import angular from 'angular';
import template from './mysql.html'


const controller = 'adminMYSQLCtrl';

class IndexCtrl {
    constructor($scope, $state, RestCli) {
        this.RestCli = RestCli
        this.$scope = $scope



        $scope.serverModel = {

        }
        $scope.databaseModel = {

        }
        $scope.userModel = {

        }

        $scope.update = () => {
            RestCli.get('v1/nodes?pageSize=100').then((nodes) => {
                console.log(nodes)
                $scope.nodes = nodes
            })

            RestCli.get('v1/mysql/servers?pageSize=100').then((servers) => {
                console.log(servers)
                $scope.servers = servers
            })

            RestCli.get('v1/mysql/users?pageSize=100').then((users) => {
                console.log(users)
                $scope.users = users
            })

            RestCli.get('v1/mysql/databases?pageSize=100').then((databases) => {
                console.log(databases)
                $scope.databases = databases
            })
        }

        $scope.createServer = () => {

            const model = $scope.serverModel

            if (model.node &&
                model.name &&
                model.hostname &&
                model.port &&
                model.username &&
                model.password) {

                model.loading = true



                const data = {
                    node: model.node,
                    name: model.name,

                    hostname: model.hostname,
                    port: model.port,
                    username: model.username,
                    password: model.password,
                }

                RestCli.post(`v1/mysql/servers`, data).then((nameserver) => {
                    $scope.reset()
                    $scope.update();
                })
            }

        }
        
        $scope.removeDatabase = (database) => {
            RestCli.delete(`v1/mysql/databases/${database.id}`).then(() => {
                $scope.reset()
                $scope.update();
            })
        }
        $scope.createDatabase = () => {

            const model = $scope.databaseModel

            if (model.server &&
                model.name) {
                model.loading = true

                const data = {
                    server: model.server,
                    name: model.name,
                }

                RestCli.post(`v1/mysql/databases`, data).then((nameserver) => {
                    model.loading = true
                    $scope.reset()
                    $scope.update();
                })
            }

        }
        $scope.removeUser = (user) => {
            RestCli.delete(`v1/mysql/users/${user.id}`).then(() => {
                $scope.reset()
                $scope.update();
            })
        }
        $scope.createUser = () => {

            const model = $scope.userModel

            if (model.database &&
                model.username &&
                model.password) {
                model.loading = true

                const data = {
                    database: model.database,
                    username: model.username,
                    password: model.password,
                }

                RestCli.post(`v1/mysql/users`, data).then((nameserver) => {
                    model.loading = true
                    $scope.reset()
                    $scope.update();
                })
            }

        }

        $scope.reset = () => {


            $scope.serverModel = {

            }
            $scope.databaseModel = {

            }
            $scope.userModel = {

            }
        }

        $scope.update();
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/mysql",
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

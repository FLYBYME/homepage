import angular from 'angular';
import template from './firewall.html'
import Graph from 'p2p-graph';

const controller = 'adminFirewallCtrl';

class IndexCtrl {
    constructor($scope, RestCli) {
        this.url = 'https://github.com/preboot/angular-webpack';
        this.RestCli = RestCli
        var graph = new Graph('#t-graph')

        graph.on('select', function (id) {
            console.log(id + ' selected!')
        })
        graph.add({
            id: 'internet',
            // me: true,
            name: 'internet'
        })
        graph.seed('internet', true)

        RestCli.get(`v1/noc/firewall/rules?pageSize=100&populate=node&sort=node&sort=jump`).then((rules) => {
            console.log('rules', rules)
            $scope.rules = rules;
        })
        RestCli.get(`v1/nodes/network-list?pageSize=100`).then((networks) => {


            $scope.publicNetworks = networks.filter((network) => network.public && network.family !== "ipv6")

            networks = $scope.networks = networks.filter((network) => !network.docker && network.family !== "ipv6").sort((a, b) => a.public - b.public);
            const subnets = []
            for (let index = 0; index < networks.length; index++) {
                const network = networks[index];
                console.log(network.public)

                const list = graph.list()
                if (network.public) {

                    if (!graph.areConnected(network.node, 'internet'))
                        graph.connect(network.node, 'internet')
                    continue;
                }

                if (!subnets.includes(network.network)) {
                    subnets.push(network.network)
                    graph.add({
                        id: network.network,
                        me: true,
                        name: network.network
                    })
                }

                if (!list.find((peer) => peer.id == network.node))
                    graph.add({
                        id: network.node,
                        name: network.node
                    })
                if (!graph.areConnected(network.network, network.node))
                    graph.connect(network.network, network.node)
            }

            console.log('networks', $scope.networks)
        })
    }


    static StateProvider($stateProvider) {
        $stateProvider.state(controller, {
            url: "/admin/firewall",
            views: {
                main: {
                    template,
                    controller
                }
            }
        })
    }
}


angular.module('app')
    .config(IndexCtrl.StateProvider)
    .controller(controller, IndexCtrl);

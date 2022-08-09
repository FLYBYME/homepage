import angular from 'angular';


angular.module('app')
    .factory("Models", () => {
        return {


            ////////////////////////
            ////////////////////////
            ////////////////////////
            'v1/spaces': {
                route: 'v1/spaces',
                title: 'Spaces',
                description: '',
                controller: 'spaceCtrl',
                fields: [{
                    title: 'name',
                    key: 'name',
                    sort: true
                }, {
                    title: 'domain',
                    key: 'domain',
                    sort: true
                }, {
                    title: 'websites',
                    key: 'websites',
                    populate: {
                        type: 'array',
                        direct: true,
                        controller: 'websiteCtrl',
                        action: "v1/spaces/:space/websites",
                        field: 'name',
                        params: {
                            fields: ['id', 'name', 'asn'],
                        }
                    },
                    sort: false
                }, {
                    title: 'mysqls',
                    key: 'mysqls',
                    populate: {
                        type: 'array',
                        direct: true,
                        action: "v1/spaces/:space/websites",
                        field: 'name',
                        params: {
                            fields: ['id', 'name', 'asn'],
                        }
                    },
                    sort: false
                }]
            },
            'v1/spaces/:space/websites': {
                route: 'v1/spaces/:space/websites',
                title: 'Website',
                description: '',
                fields: [{
                    title: 'space',
                    key: 'space',
                    populate: {
                        action: "v1/spaces",
                        field: 'name',
                        params: {
                            fields: ['id', 'name'],

                        }
                    },
                    sort: true
                }, {
                    title: 'name',
                    key: 'name',
                    sort: true
                }, {
                    title: 'online',
                    key: 'online',
                    sort: true
                }, {
                    title: 'template',
                    key: 'template',
                    sort: true
                }, {
                    title: 'size',
                    key: 'size',
                    sort: true
                }, {
                    title: 'contianer',
                    key: 'contianer',
                    sort: true
                }, {
                    title: 'route',
                    key: 'route',
                    sort: true
                }]
            },








            ////////////////////////
            ////////////////////////
            ////////////////////////







            'v1/roles': {
                route: 'v1/roles',
                title: 'Accounts Roles',
                description: '',
                fields: [{
                    title: 'name',
                    key: 'name',
                    sort: true
                }, {
                    title: 'description',
                    key: 'description',
                    sort: true
                }, {
                    title: 'permissions',
                    type: 'array',
                    key: 'permissions',
                    sort: true
                }, {
                    title: 'inherits',
                    type: 'array',
                    key: 'inherits',
                    sort: true
                }, {
                    title: 'status',
                    key: 'status',
                    sort: true
                }, {
                    title: 'Created',
                    key: 'createdAt',
                    sort: true,
                    type: 'time'
                }]
            },
            ////////////////////////
            ////////////////////////
            ////////////////////////
            'v1/balancers': {
                route: 'v1/balancers',
                title: 'System Balancers',
                description: '',
                fields: [{
                    title: 'FQDN',
                    key: 'fqdn',
                    sort: true
                }, {
                    title: 'Location',
                    key: 'location',
                    sort: true
                }, {
                    title: 'Node',
                    key: 'node',
                    sort: true,
                    populate: {
                        action: "v1/nodes",
                        params: {

                        }
                    }
                }, {
                    title: 'Created',
                    key: 'createdAt',
                    sort: true,
                    type: 'time'
                }]
            },

            'v1/noc/hosts': {
                route: 'v1/noc/hosts',
                title: 'NOC Hosts',
                description: '',
                populate: ['network'],
                fields: [{
                    title: 'Network',
                    key: 'network',
                    populate: {
                        action: "v1/noc/networks",
                        field: 'name',
                        params: {
                            fields: ['id', 'name'],

                        }
                    },
                    sort: false
                }, {
                    title: 'IP',
                    key: 'ip',
                    sort: true,
                    search: true
                }, {
                    title: 'Hostname',
                    key: 'hostname',
                    sort: true,
                    search: true
                }, {
                    title: 'hits',
                    key: 'hits',
                    sort: true
                }, {
                    title: 'score',
                    key: 'score',
                    sort: true
                }, {
                    title: 'Created',
                    key: 'createdAt',
                    sort: true,
                    type: 'time'
                }]
            },

            'v1/noc/networks': {
                route: 'v1/noc/networks',
                title: 'NOC networks',
                description: '',
                fields: [{
                    title: 'ASN',
                    key: 'asns',
                    populate: {
                        type: 'array',
                        direct: true,
                        action: "v1/noc/asns",
                        field: 'name',
                        params: {
                            fields: ['id', 'name', 'asn'],
                        }
                    },
                    sort: false
                }, {
                    title: 'Name',
                    key: 'name',
                    search: true,
                    sort: true
                }, {
                    title: 'Description',
                    key: 'description',
                    sort: true
                }, {
                    title: 'Low',
                    key: 'rangeLowIP',
                    sort: true
                }, {
                    title: 'High',
                    key: 'rangeHighIP',
                    sort: true
                }, {
                    title: 'Created',
                    key: 'createdAt',
                    sort: true,
                    type: 'time'
                }]
            },

            'v1/noc/asns': {
                route: 'v1/noc/asns',
                title: 'NOC ASNs',
                description: '',
                fields: [{
                    title: 'ASN',
                    key: 'asn',
                    sort: false
                }, {
                    title: 'name',
                    key: 'name',
                    search: true,
                    sort: true
                }, {
                    title: 'description',
                    key: 'description',
                    sort: true
                }, {
                    title: 'Created',
                    key: 'createdAt',
                    sort: true,
                    type: 'time'
                }]
            }








        }
    })
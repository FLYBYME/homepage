import querystring from 'querystring';
import angular from 'angular';
import template from './table.html'


const controller = 'tableDirective';

class TableDirective {
    constructor(RestCli, Models, $compile, $state) {
        this.RestCli = RestCli;
        this.Models = Models;
        this.$compile = $compile;
        this.$state = $state;
        this.restrict = 'E'
        this.template = template
        this.scope = {
            config: '@',
            params: '='
        }

        this.model = {
            pageSize: 10,
            totalPages: 0,
            page: 1,
            total: 0,
            sort: undefined,
            search: '',
            searchFields: [],
            searchDebounce: 0,
            populate: [],
            rows: [],
            fields: ['id'],
            params: {},
        }

        this.config;
        this.data;

        this.elements = []

        this.store = new Map()
        this.visable = new Map()

        this.SECOND = 1000;
        this.MINUTE = this.SECOND * 60;
        this.HOURS = this.MINUTE * 60;
        this.DAYS = this.HOURS * 24;
        this.YEARS = this.DAYS * 365;

        this.id = 0
    }


    controller($scope) {
        this.$scope = $scope
        $scope.directive = this

    }

    async link(scope, element, attrs) {
        this.scope = scope
        this.config = this.Models[scope.config]
        scope.directive = this



        const routeSplit = this.config.route.split('/')
        const route = []

        for (let index = 0; index < routeSplit.length; index++) {
            const part = routeSplit[index];
            if (part[0] == ':') {
                const key = part.substring(1, part.length)

                this.model.params[key] = key
            } else {
                route.push(part)
            }
        }


        for (let index = 0; index < this.config.fields.length; index++) {
            const field = this.config.fields[index];
            this.model.fields.push(field.key)
            if (field.search) {
                this.model.searchFields.push(field.key)
            }
            if (field.populate && field.populate.direct) {
                this.model.populate.push(field.key)
            }
        }

        this.generateElements(scope, element, attrs)
        this.update()
    }

    searchChange() {
        console.log('searchChange', this.model.search)
        clearTimeout(this.model.searchDebounce)
        this.model.searchDebounce = setTimeout(async () => {
            await this.list()
            this.update()
        }, 500)

    }


    async updateEntityPopulate(entity, field, element) {
        const Models = this.Models
        const store = this.store
        if (field.populate.direct) {
            if (field.populate.type == 'array') {
                if (entity[field.key][0])
                    element.text(entity[field.key].length)
            } else {
                element.text(entity[field.key][field.populate.field])
            }


        } else {



            const id = entity[field.key];


            if (!id) {
                return;
            }
            if (!store.has(id)) {
                console.log(entity)

                const res = await this.RestCli.get(`${Models[field.populate.action].route}/${id}?${querystring.stringify({ fields: field.populate.params.fields })}`)
                    .catch(() => null)
                if (res)
                    store.set(id, res)
            }

            if (store.has(id))
                element.text(store.get(id)[field.populate.field])



        }
    }


    async updateEntity(entity, tr) {
        const tbody = this.tbody;
        const fields = this.config.fields;
        const store = this.store
        const Models = this.Models
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const key = `${entity.id}:${field.key}`

            if (!store.has(key)) {
                store.set(key, this.createElement('td', tr))
                if (field.populate && field.populate.type == 'array' && field.populate.controller) {

                    const a = this.createElement('a', store.get(key))
                    store.set(key, this.createElement('td', tr))
                    a.text('View')
                    a.on('click', () => {
                        const params = {}

                        const configRoute = this.Models[field.populate.action].route
                        const routeSplit = configRoute
                            .split('/')
                            .filter((part) => part[0] == ':')
                            .map((part) => part.substring(1, part.length))

                        const last = routeSplit.shift()
                        params['id'] = entity.id


                        for (let index = 0; index < routeSplit.length; index++) {
                            const part = routeSplit[index];

                            params[part] = entity[part]

                        }





                        console.log(field.populate.controller, params, this.model.params)
                        this.$state.go(field.populate.controller, params);

                    })
                }
            }
            const element = store.get(key)

            if (field.populate) {

                this.updateEntityPopulate(entity, field, element)
            } else {

                switch (field.type) {
                    case 'time':
                        element.text(this.updateMinutes(Date.now() - entity[field.key]))
                        break;

                    default:
                        element.text(entity[field.key])
                        break;
                }

            }

        }

    }

    async update() {

        const tbody = this.tbody;
        const data = await this.list()
        const rows = data.rows;
        const fields = this.config.fields;



        const store = this.store

        const elements = Array.from(tbody.children())

        for (let index = 0; index < elements.length; index++) {
            const el = elements[index];
            el.remove()
        }


        for (let index = 0; index < rows.length; index++) {
            const entity = rows[index];

            const key = `${entity.id}:tr`

            if (!store.has(key)) {
                store.set(key, this.createElement('tr'))
                this.createElement('td', store.get(key)).text(index)
            }
            const tr = store.get(key)
            this.updateEntity(entity, tr)


            tbody.append(tr)
        }




    }

    changePageSize(el) {
        console.log(el)
        console.log('changePageSize')
        this.update()
    }


    generateElements(scope, element, attrs) {


        const mainEl = angular.element(element)



        const config = this.config;
        const table = this.createElement('table', element)

        table.addClass('table table-bordered')

        this.createTableHead(table)

        this.createTableBody(table)

        this.createPaganation(element, scope)


    }

    sorfByField(field) {
        if (this.model.sort == null || this.model.sort.field != field.key) {
            this.model.sort = { field: field.key, direction: true }
        } else {
            this.model.sort.direction = !this.model.sort.direction
        }
    }

    createPaganation(element, scope) {
        const main = this.createElement('div', element)

        main.addClass('clearfix')

        const hints = this.createElement('div', 'Showing <b>{{directive.model.rows.length||0}}</b> out of <b>{{directive.model.total}}</b> entries. Page <b>{{directive.model.page}}</b> out of <b>{{directive.model.totalPages}}</b> Pages', main)
        hints.addClass('hint-text')



        this.pagination = this.createElement('ul', main)
        this.pagination.addClass('pagination')


        this.paginationGroup = this.createPaganationGroup()

        const previous = this.paginationGroup[0]
        const next = this.paginationGroup[this.paginationGroup.length - 1]

        previous.a.text('Previous')
        next.a.text('Next')

        previous.a.on('click', async () => {
            if (this.model.totalPages > this.model.page) {
                this.model.page--;
                await this.list()
                this.update()
            }
        })
        next.a.on('click', async () => {
            if (this.model.totalPages > this.model.page) {
                this.model.page++;
                await this.list()
                this.update()
            }
        })




    }

    createPaganationGroup() {

        const group = [];

        for (let index = 0; index < 2; index++) {
            const li = this.createElement('li', this.pagination)
            const a = this.createElement('a', li)
            li.addClass('page-item')
            a.text('...')
            group.push({
                li, a
            })
        }
        return group
    }

    updatePaganation() {



        for (let index = 1; index < 6; index++) {

            if (index <= this.model.page) {

            }

            const i = this.model.totalPages
            const element = this.paginationGroup[index];

        }

    }

    createTableBody(table) {
        const config = this.config
        this.tbody = this.createElement('tbody', table)




    }

    createTableHead(table) {
        const config = this.config
        const thead = this.createElement('thead', table)

        const theadTR = this.createElement('tr', thead)

        const theadHT = this.createElement('th', theadTR)
        theadHT.text('#')

        for (let index = 0; index < config.fields.length; index++) {
            const field = config.fields[index]
            const th = this.createElement('th', theadTR)
            th.text(field.title)

            if (field.sort) {
                const i = this.createElement('i', th)
                i.addClass('fa fa-sort')
                i.on('click', () => {
                    console.log('click')
                    this.sorfByField(field)
                    this.update()
                })
            }

        }
    }

    createElement(elementType, ...appends) {
        const $compile = this.$compile;

        let html = ''

        if (typeof appends[0] == 'string') {
            html = appends.shift()
        }


        const element = $compile(`<${elementType}>${html}</${elementType}>`)(this.scope);

        element.id = `ID${this.id++}`
        for (let index = 0; index < appends.length; index++) {
            const el = appends[index];
            el.append(element);
        }

        return element
    }


    updateMinutes(millsAgo) {
        if (millsAgo >= this.YEARS) {

            const timeAgo = Math.floor(millsAgo / this.YEARS);
            return timeAgo + " y"
        } else if (millsAgo >= this.DAYS) {

            const timeAgo = Math.floor(millsAgo / this.DAYS);
            return timeAgo + " d"
        } else if (millsAgo >= this.HOURS) {

            const timeAgo = Math.floor(millsAgo / this.HOURS);
            return timeAgo + " h"
        } else if (millsAgo >= this.MINUTE) {

            const timeAgo = Math.floor(millsAgo / this.MINUTE);
            return timeAgo + " m"
        } else {
            const timeAgo = Math.floor(millsAgo / this.SECOND);
            return timeAgo + " s"
        }
    }


    format(entity, field) {
        let string = ''
        switch (field.type) {
            case 'time':
                string = this.updateMinutes(Date.now() - new Date(entity[field.key]))
                break;
            default:
                string = entity[field.key]
                break;
        }

        return string;
    }

    list() {


        const data = {
            pageSize: this.model.pageSize,
            page: this.model.page,
        }
        if (this.model.sort) {

            const field = this.model.sort.field
            const direction = this.model.sort.direction

            data.sort = `${direction ? '' : '-'}${field}`
        }
        if (this.model.fields.length > 0) {
            data.fields = this.model.fields
        }
        if (this.model.search.length > 0) {
            data.search = this.model.search
            data.searchFields = this.model.searchFields
        }
        if (this.model.populate.length > 0) {
            data.populate = this.model.populate
        }

        let route = this.config.route;


        const keys = Object.keys(this.model.params)
        if (keys.length == 1) {
            const key = keys[0]
            console.log(key)
            if (this.scope.params && this.scope.params['id'])
                route = route.replace(`:${key}`, this.scope.params['id'])
            else if (this.$state.params['id'])
                route = route.replace(`:${key}`, this.$state.params['id'])
            console.log(route)
        } else {
            keys.forEach((key) => {
                if (this.scope.params[key])
                    route = route.replace(`:${key}`, this.scope.params[key])
                else if (this.$state.params[key])
                    route = route.replace(`:${key}`, this.$state.params[key])
                console.log(route)
            })
        }


        return this.RestCli.get(`${route}?${querystring.stringify(data)}`).then((data) => {
            this.data = data
            this.model.total = data.total
            this.model.totalPages = data.totalPages
            this.model.page = data.page
            this.model.rows = data.rows

            return this.model
        })
    }

}


angular.module('app')
    .directive(controller, (RestCli, Models, $compile, $state) => {
        console.log('controller', Models)
        const driective = new TableDirective(RestCli, Models, $compile, $state)

        return {
            restrict: 'E',
            template,
            scope: driective.scope,
            controller: driective.controller,
            link: (scope, element, attrs) => driective.link(scope, element, attrs)
        }
    });

import angular from 'angular';
import EventEmitter from 'events';

const controller = 'RestCli';

class RestCliFactory extends EventEmitter {
    constructor($http, ActionFactory) {
        super();
        this.url = 'http://10.73.50.2:4000/api';
        this.$http = $http;

        this.token = localStorage.getItem('token')
        this.userObject = null

        if (this.token) {
            this.$http.defaults.headers.common['authorization'] = `Bearer ${this.token}`;
            this.user()
        }



        //this.accounts = new AccountsFactory(this)

        this.user()
        this.createStats()
    }
    watch(key) {
        const string = JSON.stringify({
            add: [{
                key,
            }],
            remove: []
        })

        if (!this.socket.open) {

            this.once('socket', () => {
                this.socket.send(string);
            })
        } else {
            this.socket.send(string);
        }
    }
    unwatch(key) {

        const string = JSON.stringify({
            add: [],
            remove: [{
                key,
            }]
        })

        if (!this.socket.open) {

            this.once('socket', () => {
                this.socket.send(string);
            })
        } else {
            this.socket.send(string);
        }
    }
    createStats() {


        this.socket = new WebSocket(`wss://stats.one-host.ca/${this.token}`);



        // Listen for messages
        this.socket.addEventListener('open', () => {
            this.socket.open = true
            this.emit('socket')
        });

        // Listen for messages
        this.socket.addEventListener('message', (event) => {
            const json = JSON.parse(event.data)
            this.emit('stats', json.key, json.value)
        });
    }
    post(path, data) {
        return this.$http.post(`${this.url}/${path}`, data)
            .then((responce) => responce.data)
            .catch((responce) => Promise.reject(responce.data))
    }
    get(path) {
        return this.$http.get(`${this.url}/${path}`)
            .then((responce) => responce.data)
            .catch((responce) => Promise.reject(responce.data))
    }
    put(path, data) {
        return this.$http.put(`${this.url}/${path}`, data)
            .then((responce) => responce.data)
            .catch((responce) => Promise.reject(responce.data))
    }
    patch(path, data) {
        return this.$http.patch(`${this.url}/${path}`, data)
            .then((responce) => responce.data)
            .catch((responce) => Promise.reject(responce.data))
    }
    delete(path) {
        return this.$http.delete(`${this.url}/${path}`)
            .then((responce) => responce.data)
            .catch((responce) => Promise.reject(responce.data))
    }

    isAuth() {
        return !!this.token
    }

    login({ email, password }) {
        if (this.isAuth()) {
            return Promise.resolve(this.token)
        }
        return this.post('v1/accounts/login', {
            email, password
        }).then(({ token }) => {
            this.token = token
            localStorage.setItem('token', token)
            this.$http.defaults.headers.common['authorization'] = `Bearer ${token}`;

            return this.user().then((user) => {
                return this.profile().then((profile) => {
                    this.emit('auth')
                    return this.userObject
                })
            })
        })
    }

    logout() {
        delete this.$http.defaults.headers.common['authorization']
        this.token = null
        this.userObject = null
        localStorage.removeItem('token')
        this.emit('auth')
        return Promise.resolve()
    }
    user() {
        if (!this.userObject) {
            this.get(`v1/accounts/me`).then((user) => {
                if (!this.userObject) {
                    this.emit('auth')
                }
                this.userObject = user
                return user
            })
        }
        return Promise.resolve(this.userObject)
    }
    profile() {
        if (!this.profileObject && this.userObject) {
            this.get(`v1/accounts/profile`).then((profile) => {
                if (!this.profileObject) {
                    this.emit('auth')
                }
                this.profileObject = profile
                return profile
            })
        }
        return Promise.resolve(this.profileObject)
    }
    profileUpdate() {
        if (this.profileObject && this.userObject) {
            this.post(`v1/accounts/profile`, this.profileObject).then((profile) => {

                this.profileObject = profile
                return profile
            })
        }
        return Promise.resolve(this.profileObject)
    }
    role(...roles) {
        if (!this.isAuth() || !this.userObject) {
            return roles.includes('public')
        }

        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            if (this.userObject.roles.includes(role)) {
                return true;
            }
        }
        return false;
    }
    register(data) {
        if (!this.isAuth()) {
            if (this.userObject)
                return Promise.resolve(this.userObject);
            return this.post(`v1/accounts/register`, data)
        }
        return Promise.reject(new Error('logged in'))
    }
}

angular.module('app')
    .factory("RestCli", ($http) => new RestCliFactory($http))
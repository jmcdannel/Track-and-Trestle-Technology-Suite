import './assets/main.css'

import { createApp, provide, h } from 'vue'
import App from './App.vue'
import router from './router'
// import api from './connections/api.js'
// import dccApi from './connections/dccApi.js'
// import api from './api/api.ts';
// import { DefaultApolloClient } from '@vue/apollo-composable'
// import { ApolloClient, InMemoryCache } from '@apollo/client/core'

// mongodb+srv://mcdannel:cn5LRr7N6XNrEQpR@trestlemongodb.p0zygcb.mongodb.net/
// const DENO_API_DB_USR=mcdannel
// const DENO_API_DB_PWD=cn5LRr7N6XNrEQpR
// const DB_CONNECTION = `mongodb+srv://${env["DENO_API_DB_USR"]}:${
//   env["DENO_API_DB_PWD"]
// }@trestlemongodb.p0zygcb.mongodb.net/?authMechanism=SCRAM-SHA-1`;
// const cache = new InMemoryCache()
// const apolloClient = new ApolloClient({
//   cache,
//   uri: 'https://rickandmortyapi.com/graphql',
// })


// api.connect()
// dccApi.connect()

// const app = createApp({
//   setup () {
//     provide(DefaultApolloClient, apolloClient)
//   },

//   render: () => h(App),
// })

const app = createApp(App)

app.use(router)

app.mount('#app')

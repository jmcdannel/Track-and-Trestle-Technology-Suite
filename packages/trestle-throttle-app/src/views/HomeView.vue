<script setup lang="ts">
import SelectLoco from '../throttle/SelectLoco.component.vue'
  // import { onMounted, ref } from 'vue';
  // import axios from "axios";
  // import api from '../api/api.ts';
  // import * as Realm from "realm-web";


  // import InterfaceList from '../connections/InterfaceList.component.vue'
  // import { LAYOUT_ID } from '../constants.js';

  // const {
  //   BSON: { ObjectId },
  // } = Realm;


  // const PROJECT_ID = 'graphql-qjqqk'
  // const APP_ID = 'graphql-qjqqk'
  // const DATA_SOURCE_NAME = 'mongodb-atlas'
  // const DATABASE_NAME = 'trestledb'
  // const COLLECTION_NAME = 'layouts'

  // // console.log('Realm', Realm);
  // const app = new Realm.App({ id: APP_ID });
  // const credentials = Realm.Credentials.apiKey('9LPabYfHOJfmZPXtKa2wQHA1Dyzb2y5T5vPPfAfW8sEy9h3HTKmIHGgLtKXjRVV1');
  // try {
  //   const user = await app.logIn(credentials);
  // } catch(err) {
  //   console.error("Failed to log in", err);
  // }

  // const mongo = app?.currentUser?.mongoClient(DATA_SOURCE_NAME);
  // const db = mongo?.db(DATABASE_NAME);
  // const collection = db?.collection(COLLECTION_NAME);

  // console.log('mongo, db, collection', mongo, db, collection);

  // const layout: any = ref(null);

  // onMounted(async () => {
  //   console.log('Home.onMounted');
  //   // await getLayout(LAYOUT_ID);
  // });

  // async function getLayout(layoutId:string) {
  //   try {
  //     // const { data } = await axios.get(`/api/layouts/${layoutId}`);

  //     // console.log('[LAYOUT] data', data);
  //     const layoutCol = await api.layouts.get(LAYOUT_ID);
  //     console.log('layoutCol', layoutCol);
  //     layout.value = layoutCol;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // await getLayout(LAYOUT_ID);

  // const CHARACTERS_QUERY = gql`
  //   query Characters {
  //     characters {
  //       results {
  //         id
  //         name
  //         image
  //       }
  //     }
  //   }
  // `

  // const { result, loading, error } = useQuery(CHARACTERS_QUERY);
  

</script>

<template>
  <main>
    <SelectLoco />
    <!-- <p v-if="error">Something went wrong...</p>
    <p v-if="loading">Loading...</p> -->
    <!-- <p v-else v-for="character in result.characters.results" :key="character.id">
      {{ character.name }}
    </p> -->

    <!-- <InterfaceList v-if="layout?.interfaces" :interfaces="layout?.interfaces" /> -->
  </main>
</template>

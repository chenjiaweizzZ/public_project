<template>
<transition name='fade' mode = "out-in">
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
    <!-- <router-view transition="fade" transition-mode="out-in" keep-alive></router-view> -->
</template>

<script>

import { mapState, mapActions } from 'vuex';
import $ from 'jquery';

export default {
    mounted: function(){

    },
    components: {

    },
    computed: mapState([

    ]),
    methods: {
        ...mapActions([

        ])
    }
}
</script>

<style>
</style>
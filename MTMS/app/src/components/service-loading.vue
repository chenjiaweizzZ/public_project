<template>
    <div class="loading_service" v-show = "loading">
        <div class="loading-content" v-show = "loadingIcon">
            <span class="service-icon">
                <img src="../assets/images/loading.gif">
            </span>
        </div>
    </div>
</template>
<style>
    .loading_service {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height:100%;
        background: rgba(0, 0, 0, 0);
        z-index: 9999999;
    }
    .loading-content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    .service-icon {
        width: .6rem;
        height: .6rem;
        background: rgba(0, 0, 0, 0.4);
        border-radius: .05rem;
    }
    .service-icon img {
        /*margin-top: .5rem;*/
        width: .5rem;
    }
</style>
<script>

    export default {
        props:['loading','loadingIcon'],
        data() {
            return {

            }
        },
        methods: {

        }
    }
</script>

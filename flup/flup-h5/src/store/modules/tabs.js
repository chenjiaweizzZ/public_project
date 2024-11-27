let state = () => ({
    featuredServiceTab: "1",
    featuredServiceCurrentIndex: "",
    featuredServiceCurrentIndex2: ""
})
let mutations = {
    setFeaturedServiceTab(state, value) {
        state.featuredServiceTab = value
    },
    setFeaturedServiceCurrentIndex(state, value) {
        state.featuredServiceCurrentIndex = value
    },
    setFeaturedServiceCurrentIndex2(state, value) {
        state.featuredServiceCurrentIndex2 = value
    }
}


export default {
    namespaced: true,
    state,
    mutations
}
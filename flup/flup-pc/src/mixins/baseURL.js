export default {
    data() {
        return {
            baseURL: null,
        }
    },
    methods: {
        getBaseUrl(panel) {
            let origin = window.location.origin;
            if (window.location.href.includes("/flup/web")) {
                this.baseURL = origin + panel
            } else {
                this.baseURL = origin
            }
        },
    }
}

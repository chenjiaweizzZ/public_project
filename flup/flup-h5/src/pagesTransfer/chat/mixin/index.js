export default {
	methods: {
		restInfo(info){
            let obj = JSON.parse(info.data);
            return obj;
        }
	}
};

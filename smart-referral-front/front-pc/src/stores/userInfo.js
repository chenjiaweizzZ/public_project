import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { storage } from "@/utils/storage";

export const userInfoStore = defineStore(
  "userInfo",
  () => {
    let userInfo = reactive({});
    let token = ref("");
    let paths = ref([]);
    const setToken = (value) => {
      token.value = value;
    };
    const setUserInfo = (value) => {
      userInfo = Object.assign(userInfo, value);
    };
    const setPaths = (value) => {
      paths.value = value;
    };
    return {
      userInfo,
      token,
      paths,
      setUserInfo,
      setToken,
      setPaths
    };
  },
  {
    // 自定义storeage存储
    persist: {
      storage: {
        getItem(key) {
          return storage.getSessionStorage(key);
        },
        setItem(key, value) {
          return storage.setSessionStorage(key, value);
        },
      },
    },
  }
);

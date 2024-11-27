/**
 * @description pinia 统一状态管理
 * @author 刘晨明
 */
import { defineStore } from "pinia";

export const useStore = defineStore("useStore", {
  state: () => {
    return {
      userId: "",
    };
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
  },
  actions: {
    setUserId(id) {
      this.userId = id;
    },
  },
});

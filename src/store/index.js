import Vue from "vue";
import Vuex from "vuex";
import VuexReset from "@ianwalter/vuex-reset";
import app from "./app/";
import components from "../components/store";

Vue.use(Vuex);

export default new Vuex.Store({
  // state: {},
  // getters: {},
  // mutations: {},
  // actions: {},
  modules: {
    app,
    components,
  },
  plugins: [VuexReset()],
  strict: process.env.NODE_ENV !== "production",
});

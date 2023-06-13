import Vue from "vue";
import axios from "axios";
import router from "../router";
import store from "../store";

const Axios = axios.create({
  baseURL: `${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}/api`,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("igtrato:token"),
  },
});

Axios.interceptors.response.use(
  (response) => {
    if (response.data) {
      if (typeof response.data.mensagem === "string")
        Vue.prototype.$notificacao(response.data.mensagem);
      else if (typeof response.data.erro === "string") {
        if (response.data.tipo === "Error")
          Vue.prototype.$notificacao(response.data.erro, "erro", true);
        else Vue.prototype.$notificacao(response.data.erro, "erro", true);
      } else if (typeof response.data.atencao === "string")
        Vue.prototype.$notificacao(response.data.atencao, "atencao");
      else if (typeof response.data.informacao === "string")
        Vue.prototype.$notificacao(response.data.informacao, "informacao");
    }

    return response;
  },
  (error) => {
    const lastRequest = error.config;

    if (
      (!error.response || !error.response.data) &&
      (!store.state.server || store.state.server.status)
    ) {
      console.log(store.state.server || !!store.state.server.status);
      Vue.prototype.$notificacao(
        "Erro ao processar requisição. Tente novamente ou entre em contato com a TI!",
        "erro"
      );
    } else if (error.response.status === 401 && !lastRequest._retry) {
      localStorage.removeItem("igtrato:token");
      localStorage.removeItem("igtrato:nome");
      localStorage.removeItem("igtrato:paginas-usuario");

      router.push({
        path: "/login",
        query: { to: store.getters["app/toUrl"] },
      });

      lastRequest._retry = true;
    } else if (error.response.status === 403) {
      Vue.prototype.$notificacao("Usuário sem permissão", "atencao");
    } else if (error.response.status === 404) {
      Vue.prototype.$notificacao("Requisição não encontrada!", "erro");
    }

    return Promise.reject(error);
  }
);

Vue.prototype.$axios = Axios;

export default Axios;

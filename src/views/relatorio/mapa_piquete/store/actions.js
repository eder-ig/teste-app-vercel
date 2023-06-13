import axios from "@/plugins/axios";

export const listar = async ({ commit }) => {
  try {
    const res = await axios.get("confinamento/mapa-curral/listar");

    if (res && !res.data.erro) {
      commit("registros", res.data.registros);
      commit("agendasTrato", res.data.agendasTrato);
      commit("dietas", res.data.dietas);
      commit("totais", {
        capacidadeMaxima: res.data.capacidadeMaxima,
        totalAnimais: res.data.totalAnimais,
      });
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

import axios from "@/plugins/axios";

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("relatorio/lotes-ativos/listar", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("registros", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const imprimir = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("relatorio/lotes-ativos/imprimir", {
      params: filtros,
    });

    return res.data;
  } catch (error) {
    return null;
  }
};

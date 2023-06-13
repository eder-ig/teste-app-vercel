import axios from "@/plugins/axios";

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/alimento/listar", {
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
export const exibir = async ({ commit }, propriedadeId) => {
  try {
    const res = await axios.get(
      "/confinamento/alimento/exibir/" + propriedadeId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/alimento/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/alimento/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, propriedadeId) => {
  try {
    const res = await axios.delete(
      "/confinamento/alimento/excluir/" + propriedadeId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

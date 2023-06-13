import axios from "@/plugins/axios";

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/propriedade/listar", {
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
      "/confinamento/propriedade/exibir/" + propriedadeId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/propriedade/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/propriedade/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, propriedadeId) => {
  try {
    const res = await axios.delete(
      "/confinamento/propriedade/excluir/" + propriedadeId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

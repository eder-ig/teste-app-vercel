import axios from "@/plugins/axios";

export const propriedadeDropdownListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/propriedade/dropdown", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("propriedadeDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/confinamento/listar", {
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
      "/confinamento/confinamento/exibir/" + propriedadeId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/confinamento/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/confinamento/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, propriedadeId) => {
  try {
    const res = await axios.delete(
      "/confinamento/confinamento/excluir/" + propriedadeId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

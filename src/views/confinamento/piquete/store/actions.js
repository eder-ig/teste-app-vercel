import axios from "@/plugins/axios";

export const exibir = async ({ commit }, piqueteId) => {
  try {
    const res = await axios.get("/confinamento/piquete/exibir/" + piqueteId);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/piquete/listar", {
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
export const dropdownLinhas = async ({ commit }) => {
  try {
    const res = await axios.get("confinamento/piquete/dropdown-linhas");

    if (!res.data.erro) {
      commit("linhas", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/piquete/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/piquete/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, propriedadeId) => {
  try {
    const res = await axios.delete(
      "/confinamento/piquete/excluir/" + propriedadeId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

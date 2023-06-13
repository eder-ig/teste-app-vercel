import axios from "@/plugins/axios";

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/raca/listar", {
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
    const res = await axios.get("/confinamento/raca/exibir/" + propriedadeId);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/raca/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/raca/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, racaId) => {
  try {
    const res = await axios.delete("/confinamento/raca/excluir/" + racaId);

    return res.data;
  } catch (error) {
    return null;
  }
};

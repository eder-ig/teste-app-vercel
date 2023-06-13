import axios from "@/plugins/axios";

export const exibir = async ({ commit }, ruaId) => {
  try {
    const res = await axios.get("/confinamento/categoria/exibir/" + ruaId);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/categoria/listar", {
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
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/categoria/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/categoria/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, ruaId) => {
  try {
    const res = await axios.delete("/confinamento/categoria/excluir/" + ruaId);

    return res.data;
  } catch (error) {
    return null;
  }
};

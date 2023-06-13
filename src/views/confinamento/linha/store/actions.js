import axios from "@/plugins/axios";

export const exibir = async ({ commit }, ruaId) => {
  try {
    const res = await axios.get("/confinamento/linha/exibir/" + ruaId);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/linha/listar", {
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
export const dropdownConfinamento = async ({ commit }) => {
  try {
    const res = await axios.get("confinamento/linha/dropdown-rua");

    if (!res.data.erro) {
      commit("ruas", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/linha/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/linha/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, ruaId) => {
  try {
    const res = await axios.delete("/confinamento/linha/excluir/" + ruaId);

    return res.data;
  } catch (error) {
    return null;
  }
};

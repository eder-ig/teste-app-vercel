import axios from "@/plugins/axios";

export const dropdownAlimentoListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "/confinamento/analise-alimento/dropdown-alimento"
    );

    if (!res.data.erro) {
      commit("dropdownAlimento", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/analise-alimento/listar", {
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
export const exibir = async ({ commit }, analiseAlimentoId) => {
  try {
    const res = await axios.get(
      "/confinamento/analise-alimento/exibir/" + analiseAlimentoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post(
      "/confinamento/analise-alimento/salvar",
      payload
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

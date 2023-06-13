import axios from "@/plugins/axios";

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/tipo-leitura-cocho/listar", {
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
export const exibir = async ({ commit }, tipoLeituraCochoId) => {
  try {
    const res = await axios.get(
      "/confinamento/tipo-leitura-cocho/exibir/" + tipoLeituraCochoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post(
      "/confinamento/tipo-leitura-cocho/salvar",
      payload
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put(
      "/confinamento/tipo-leitura-cocho/editar",
      payload
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, tipoLeituraCochoId) => {
  try {
    const res = await axios.delete(
      "/confinamento/tipo-leitura-cocho/excluir/" + tipoLeituraCochoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

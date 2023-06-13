import axios from "@/plugins/axios";

export const dropdownLotesAtivosListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/piquete/dropdown-lotes-ativos", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("dropdownLotesAtivos", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dropdownTipoLeituraCochoListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/tipo-leitura-cocho/dropdown", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("dropdownTipoLeituraCocho", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/coleta-leitura-cocho/listar", {
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

export const salvar = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "confinamento/coleta-leitura-cocho/salvar",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, coletaCochoId) => {
  try {
    const res = await axios.delete(
      "confinamento/coleta-leitura-cocho/excluir/" + coletaCochoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

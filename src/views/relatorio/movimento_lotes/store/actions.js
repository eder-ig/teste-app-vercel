import axios from "@/plugins/axios";

export const dropdownLotesAtivosListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "relatorio/movimento-lotes/dropdown-lotes-ativos",
      {
        params: filtros,
      }
    );

    if (!res.data.erro) {
      commit("dropdownLotesAtivos", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("relatorio/movimento-lotes/listar", {
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

import axios from "@/plugins/axios";

export const agendaTratoDropdownListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/agenda-trato/listar/1", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("agendaTratoDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const dropdownDietasListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "relatorio/distribuicao-trato-piquete/dropdown-dietas",
      {
        params: filtros,
      }
    );

    if (!res.data.erro) {
      commit("dropdownDietas", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const dropdownLotesAtivosListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "relatorio/distribuicao-trato-piquete/dropdown-lotes-ativos",
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
    const res = await axios.get("relatorio/distribuicao-trato-piquete/listar", {
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

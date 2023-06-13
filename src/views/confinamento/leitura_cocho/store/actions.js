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
    const res = await axios.get("confinamento/leitura-cocho/listar", {
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

export const historicoConsumoListar = async ({ commit }, loteId) => {
  try {
    const res = await axios.get(
      "confinamento/lote-movimento/listar-historico/" + loteId
    );

    if (!res.data.erro) {
      commit("historicoConsumo", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const historicoOcorrenciasListar = async ({ commit }, filtro) => {
  try {
    const res = await axios.get("confinamento/ocorrencia/listar-historico", {
      params: filtro,
    });

    if (!res.data.erro) {
      commit("historicoOcorrencias", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const coletaCochoListar = async ({ commit }, piqueteId) => {
  try {
    const res = await axios.get(
      "confinamento/coleta-leitura-cocho/listar-historico/" + piqueteId
    );

    if (!res.data.erro) {
      commit("coletaCocho", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const ultimasLeiturasListar = async ({ commit }, piqueteId) => {
  try {
    const res = await axios.get(
      "confinamento/leitura-cocho/listar-historico/" + piqueteId
    );

    if (!res.data.erro) {
      commit("ultimasLeituras", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/leitura-cocho/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, leituraCochoId) => {
  try {
    const res = await axios.delete(
      "/confinamento/leitura-cocho/excluir/" + leituraCochoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
// export const listarDia = async ({ commit }, filtros) => {
//   try {
//     const res = await axios.get("confinamento/leitura-cocho/listar-dia", {
//       params: filtros,
//     });

//     if (!res.data.erro) {
//       commit("registrosDia", res.data);
//     }

//     return res.data;
//   } catch (error) {
//     return null;
//   }
// };
// export const dropdownLinhas = async ({ commit }) => {
//   try {
//     const res = await axios.get("confinamento/leitura-cocho/dropdown-linha");

//     if (!res.data.erro) {
//       commit("linhas", res.data);
//     }

//     return res.data;
//   } catch (error) {
//     return null;
//   }
// };
// export const dropdownPiquete = async ({ commit }) => {
//   try {
//     const res = await axios.get("confinamento/leitura-cocho/dropdown-piquete");

//     if (!res.data.erro) {
//       commit("piquetes", res.data);
//     }

//     return res.data;
//   } catch (error) {
//     return null;
//   }
// };
// export const dropdownTipoLeitura = async ({ commit }) => {
//   try {
//     const res = await axios.get(
//       "confinamento/leitura-cocho/dropdown-tipo-leitura"
//     );

//     if (!res.data.erro) {
//       commit("tipoLeitura", res.data);
//     }

//     return res.data;
//   } catch (error) {
//     return null;
//   }
// };

// export const editar = async ({ commit }, payload) => {
//   try {
//     const res = await axios.put("/confinamento/leitura-cocho/editar", payload);

//     return res.data;
//   } catch (error) {
//     return null;
//   }
// };

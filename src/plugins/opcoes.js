import Vue from "vue";
// cores
// #4CAF50
// #F44336
// #FF9800
// #2196F3
// #FFEB3B
// #9E9E9E

let opcoes = {
  // 1: {
  //   Ativo: {
  //     value: 1,
  //     cor: "#4CAF50",
  //   },
  //   Finalizado: {
  //     value: 2,
  //     cor: "#9E9E9E",
  //   },
  // },
  // Tipo Equipamento
  // 2: {
  //   Ativo: {
  //     value: 1,
  //     cor: "#4CAF50",
  //   },
  //   Finalizado: {
  //     value: 2,
  //     cor: "#9E9E9E",
  //   },
  // },
  // Status Receita
  3: {
    Ativo: {
      value: 1,
      cor: "#4CAF50",
    },
    Inativa: {
      value: 2,
      cor: "#9E9E9E",
    },
  },
  // Status do Trato
  4: {
    Pendente: {
      value: 1,
      cor: "#2196F3",
    },
    Iniciado: {
      value: 2,
      cor: "#4CAF50",
    },
    Interrompido: {
      value: 3,
      cor: "#FF9800",
    },
    Finalizado: {
      value: 4,
      cor: "#9E9E9E",
    },
  },
  // Status do Trato Movimento
  5: {
    Pendente: {
      value: 1,
      cor: "#2196F3",
    },
    Iniciado: {
      value: 2,
      cor: "#4CAF50",
    },
    Finalizado: {
      value: 3,
      cor: "#9E9E9E",
    },
  },
  // Status Preparo
  6: {
    Pendente: {
      value: 1,
      cor: "#2196F3",
    },
    EmAtendimento: {
      value: 2,
      cor: "#4CAF50",
    },
    Finalizado: {
      value: 3,
      cor: "#9E9E9E",
    },
  },
  // Status Preparo Atendimento
  7: {
    Pendente: {
      value: 1,
      cor: "#2196F3",
    },
    Iniciado: {
      value: 2,
      cor: "#4CAF50",
    },
    Pausado: {
      value: 3,
      cor: "#FF9800",
    },
    Finalizado: {
      value: 4,
      cor: "#9E9E9E",
    },
  },
  // Status Analise Alimento
  8: {
    Ativa: {
      value: 1,
      cor: "#4CAF50",
    },
    Inativa: {
      value: 2,
      cor: "#9E9E9E",
    },
  },
  // Status Lote
  9: {
    Ativa: {
      value: 1,
      cor: "#4CAF50",
    },
    Finalizado: {
      value: 2,
      cor: "#9E9E9E",
    },
  },
  // Status Preparo Atendimento Ingrediente
  10: {
    Pendente: {
      value: 1,
      cor: "#4CAF50",
    },
    Iniciado: {
      value: 2,
      cor: "#2196F3",
    },
    Finalizado: {
      value: 3,
      cor: "#9E9E9E",
    },
  },
  // Status Lote Dieta
  13: {
    Pendente: {
      value: 1,
      cor: "#4CAF50",
    },
    Iniciado: {
      value: 2,
      cor: "#9E9E9E",
    },
  },
  // Status Analise Massa Seca
  14: {
    Ativa: {
      value: 1,
      cor: "#4CAF50",
    },
    Inativa: {
      value: 2,
      cor: "#9E9E9E",
    },
  },
  // Status Dieta Transição
  15: {
    Ativa: {
      value: 1,
      cor: "#4CAF50",
    },
    Inativa: {
      value: 2,
      cor: "#9E9E9E",
    },
  },
};

function statusCor(opcao, item) {
  try {
    let obj = Object.entries(opcoes[opcao]);

    return obj[item - 1][1] ? obj[item - 1][1].cor : "#000000";
  } catch (e) {
    return "#000000";
  }
}

Vue.prototype.$opcao = opcoes;
export default {
  opcoes,
  statusCor,
};

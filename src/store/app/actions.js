import axios from "@/plugins/axios";

export const login = async ({ commit }, dados) => {
  try {
    const res = await axios.post("sistema/autenticacao/login", dados);

    if (res.data.token) {
      localStorage.setItem("igtrato:token", res.data.token);
      localStorage.setItem("igtrato:login", window.btoa(dados.login));
      localStorage.setItem("igtrato:nome", window.btoa(res.data.payload.nome));

      axios.defaults.headers["Authorization"] = "Bearer " + res.data.token;
    }

    return res.data;
  } catch (error) {
    return error;
  }
};

export const obterOpcoes = async ({ commit }, grupo) => {
  try {
    const res = await axios.get("sistema/opcao/listar/" + grupo);

    if (!res.data.erro) commit("opcoes", { grupo: grupo, opcoes: res.data });

    return res.data;
  } catch (error) {
    return null;
  }
};

export const logout = async ({ commit }) => {
  try {
    const res = await axios.post("sistema/autenticacao/logout");

    if (res.data.mensagem) {
      localStorage.removeItem("igtrato:token");
      localStorage.removeItem("igtrato:nome");
      localStorage.removeItem("igtrato:paginas-usuario");

      axios.defaults.headers["Authorization"] = undefined;
    }

    return res.data;
  } catch (error) {
    return error;
  }
};

// export const obterOpcoes = async ({ commit }, grupo) => {
//   try {
//     const res = await axios.get("comum/opcao/listar/" + grupo);

//     if (!res.data.erro) commit("opcoes", { grupo: grupo, opcoes: res.data });

//     return res.data;
//   } catch (error) {
//     return null;
//   }
// };

// export const parametro = async ({ commit }, valor) => {
//   try {
//     const res = await axios.get("comum/parametro/valor", {
//       params: {
//         chave: valor,
//       },
//     });

//     if (!res.erro)
//       commit("parametros", { chave: valor, valor: res.data.valor });

//     return res.data;
//   } catch (error) {
//     return null;
//   }
// };

export const resetSenha = async ({ commit }, dados) => {
  try {
    const res = await axios.post("sistema/autenticacao/alterar-senha", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const paginasListarGroup = async ({ commit }, param) => {
  try {
    const res = await axios.get("sistema/controle-acesso/listar-grupo");

    if (res && !res.data.erro) commit("paginasUsuarioGroup", res.data);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const paginasListar = async ({ commit }, param) => {
  try {
    const res = await axios.get("sistema/controle-acesso/listar-paginas");

    if (res && !res.data.erro) {
      commit("paginasUsuario", res.data);
      localStorage.setItem(
        "igtrato:paginas-usuario",
        window.btoa(JSON.stringify(res.data))
      );
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const usuarioListar = async ({ commit }, params) => {
  try {
    const res = await axios.get("sistema/controle-acesso/usuario/listar", {
      params,
    });

    if (!res.data.erro) commit("registrosUsuarios", res.data);

    return res.data;
  } catch (error) {
    return null;
  }
};

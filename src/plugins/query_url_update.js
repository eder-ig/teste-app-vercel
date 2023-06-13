import Vue from "vue";

/**
 * @author Eder Ferraz Caciano
 * @description created at 30/09/2021
 *
 * @description Percorre um objeto e prepara para atualizar a query router
 *
 * @param {*} routerName // Nome da Rota
 * @param {*} objFilter // Objeto filtro do data da pagina
 *
 *  - Cria um objeto novo
 *  - Percorre o objeto filtro do parametro
 *  - Adiciona no novo ojbeto apenas as chaves que contenham valor
 *  - Atualiza a rota corrente passando a query com o novo objeto criado
 */
function parseQuery(routerName, objFilter, targetBlank) {
  const novoFiltro = {};
  if (objFilter) {
    Object.keys(objFilter).forEach((element) => {
      if (Array.isArray(objFilter[element]) && objFilter[element].length) {
        novoFiltro[element] = Object.values(objFilter[element]);
      }
      if (
        !Array.isArray(objFilter[element]) &&
        objFilter[element] &&
        typeof objFilter[element] === "object"
      ) {
        novoFiltro[element] = Object.assign({}, objFilter[element]);
      }
      if (
        objFilter[element] &&
        ["string", "number"].includes(typeof objFilter[element])
      ) {
        novoFiltro[element] = objFilter[element];
      }
    });

    if (this.$route.query.aux !== window.btoa(JSON.stringify(novoFiltro))) {
      if (targetBlank) {
        const r = this.$router.resolve({
          name: routerName,
          query: {
            aux: window.btoa(JSON.stringify(novoFiltro)),
          },
        });
        window.open(r.href, "_blank");
      } else {
        this.$router.replace({
          name: routerName,
          query: {
            aux: window.btoa(JSON.stringify(novoFiltro)),
          },
        });
      }
    }
  }
}

/**
 * @author Eder Ferraz Caciano
 *
 * @description created at 30/09/2021
 *
 * @description Obtem query criptografada e um objeto filtro de referencia e retorna o mesmo preenchido com os valores da query
 *
 * @param {*} queryString // query criptografada
 * @param {*} objFilter // objeto filtro de referencia para ser preenchido
 * @return {*} {} // retorna um onjeto preenchido de acordo com a referencia
 */
function queryDecode(queryString, objFilter) {
  const f = JSON.parse(window.atob(queryString));

  Object.keys(f).forEach((element) => {
    objFilter[element] = f[element];
    if (Array.isArray(f[element]) && f[element].length) {
      objFilter[element] = Object.values(f[element]);
    }
    if (
      !Array.isArray(f[element]) &&
      f[element] &&
      typeof f[element] === "object"
    ) {
      objFilter[element] = Object.assign({}, f[element]);
    }
    if (f[element] && ["string", "number"].includes(typeof f[element])) {
      objFilter[element] = f[element];
    }
  });

  return objFilter;
}

Vue.prototype.$queryParse = parseQuery;
Vue.prototype.$queryDecode = queryDecode;

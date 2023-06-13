export default {
  propriedadeDropdown(state, param) {
    param.forEach((element) => {
      element.descricao = `${element.id} | ${element.nomeFazenda} | ${element.marca}`;
    });
    state.propriedadeDropdown = param;
  },
  registros(state, param) {
    param.forEach((element) => {
      element.propriedadeDescricao = `${element.propriedade.id} | ${element.propriedade.nomeFazenda} | ${element.propriedade.marca}`;
    });
    state.registros = param;
  },
  reset: () => {},
};

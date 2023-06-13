import Sortable from "sortablejs";
const SortableTable = {
  bind(el, binding, vnode) {
    let sortableElement = el.getElementsByTagName("tbody")[0];
    const options = {
      handle: ".sortHandle",
      animation: 150,
      onUpdate: function (event) {
        vnode.child.$emit("sorted", event);
      },
    };

    Sortable.create(sortableElement, options);
  },
};

export default SortableTable;

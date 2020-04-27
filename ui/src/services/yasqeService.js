import Yasqe from "@triply/yasqe";

export const yasqeService = {
  getQuery
}


function getQuery(id) {
  const yasqe = localStorage.getItem(id);
  return yasqe ? yasqe.val.query : Yasqe.defaults.value;
}

import Yasqe from "@triply/yasqe";

export const yasqeService = {
  getQuery,
  cleanup,
  clearStorage,
  hasInstance,
}

function getQuery(id) {
  const yasqe = JSON.parse(localStorage.getItem(`yasqe_${id}`));
  return yasqe ? yasqe.val.query : Yasqe.defaults.value;
}

function cleanup() {
  for (const key in localStorage) {
    if (key.startsWith("yasqe_")) {
      localStorage.removeItem(key);
    }
  }
}

function clearStorage(id) {
  localStorage.removeItem(`yasqe_${id}`);
}

function hasInstance(id) {
  return localStorage.getItem(`yasqe_${id}`)
}

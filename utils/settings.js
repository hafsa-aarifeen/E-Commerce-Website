export default function settings() {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("settings")) {
      return JSON.parse(localStorage.getItem("settings"));
    }
    return false;
  }
  return false;
}

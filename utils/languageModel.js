export default function languageModel() {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("language")) {
            const prevObj = JSON.parse(localStorage.getItem("language"));
            const keys = Object.keys(prevObj).map((item) =>
                item
                    .replaceAll("-", " ")
                    .replaceAll(",", " ")
                    .replaceAll(".", " ")
                    .replaceAll("'", "")
                    .replaceAll("!", "")
                    .replaceAll("?", "")
                    .split(" ")
                    .join("_")
            );

            const values = Object.values(prevObj);
            const generateNewArr = values.map((item, i) => {
                let newObj = {};
                newObj[keys[i]] = item;
                return newObj;
            });
            return Object.assign.apply(Object, generateNewArr);
        }
        return false;
    }
    return false;
}

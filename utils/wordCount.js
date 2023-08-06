export default function wordCount(text = "", setLength = 3, getLength) {
  if (getLength) {
    return text.split(/\S+/).length - 1;
  } else {
    const items = text.split(" ");
    if (items && items.length >= 0) {
      const itemReturn = items.slice(0, setLength);
      if (itemReturn.length === 1) {
        return itemReturn.map((item, i) => `${items[i]}`);
      } else {
        return itemReturn.map((item, i) => `${items[i]} `);
      }
    } else {
      return text;
    }
  }
}

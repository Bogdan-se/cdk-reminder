export default function (items, size) {
    const chunked = [];
    while (items.length) {
        chunked.push(items.splice(0, size));
    }

    return chunked;
};

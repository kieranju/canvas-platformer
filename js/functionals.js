// a better splice, doesnt leave memory lying around
function splice (index, arr) {
    for (var i = index, len = arr.length - 1; i < len; i++)
        arr[i] = arr[i + 1];
    arr.length = len;
    return arr;
}

// testing HeapSort;
const heapSort = (arr) => {
  const array = [...arr];
  let largest = array.length;

  const heapify = (array, index) => {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let max = index; // max position of node index;
    if (left < largest && array[left] > array[max]) {
      max = left;
    }
    if (right < largest && array[right] > array[max]) {
      max = right;
    }
    if (max !== index) {
      [array[max], array[index]] = [array[index], array[max]];
      heapify(array, max);
    }
  };

  for (let i = Math.floor(largest / 2); i >= 0; i -= 1) {
    heapify(array, i);
  }
  for (let i = array.length - 1; i > 0; i -= 1) {
    [array[0], array[i]] = [array[i], array[0]];
    largest--;
    heapify(array, 0);
  }
  return array;
};

export default heapSort;

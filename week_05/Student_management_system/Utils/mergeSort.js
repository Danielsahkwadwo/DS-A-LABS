// Merge sort function
function mergeSort(array, sortKey, order = "asc") {
  if (array.length <= 1) return array;

  const middle = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, middle), sortKey, order);
  const right = mergeSort(array.slice(middle), sortKey, order);

  return merge(left, right, sortKey, order);
}

// Merge function
function merge(left, right, sortKey, order) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    let leftValue = left[leftIndex][sortKey];
    let rightValue = right[rightIndex][sortKey];

    // Comparison logic based on order
    if (order === "asc" ? leftValue <= rightValue : leftValue >= rightValue) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

module.exports = mergeSort;

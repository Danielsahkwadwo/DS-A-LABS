//question 2a
 export function double(arr) {
  try {
    //loop through numbers and return a square of each
    const result = arr.map((number) => {
      return number ** 2;
    });
    return result;
  } catch (error) {
    return "not a valid array";
  }
}
// console.log(double([1, 2, 3, 4, 5, 6, 7]));



//question 2b
export const filterEven = function (arr) {
  try {
    const result = arr.filter((number) => number % 2 === 0);
    return result;
  } catch (error) {
    return "not a valid array";
  }
};
// console.log(filterEven([1, 2, 3, 4, 5, 6, 7]));



//question 2c
export const sum = function (arr) {
  try {
    const sum = arr.reduce((total, number) => total + number);
    return sum;
  } catch (error) {
    return "not a valid array";
  }
};
// console.log(sum([1, 2, 3, 4, 5, 6, 7, 8, 9]));



//question 2d
const average = (arr) => {
  try {
    //sum up all numbers
    const result = arr.reduce((acc, num) => {
      return acc + num;
    });
    //divid the total sum by number or elements and return
    return result / arr.length;
  } catch (error) {
    return "not a valid array";
  }
};
// console.log(average([1, 2, 3, 4, 5, 6, 7, 8, 9]));


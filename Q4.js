import { capitalize } from "./Q1.js"
import { reverse } from "./Q1.js"
import { wordCount } from "./Q1.js"
import { double } from "./Q2.js"
import { filterEven } from "./Q2.js"
import { sum } from "./Q2.js"

// Composite function for string manipulation
const compositeStrFn= (...fn)=> str=>fn.reduce((accumulator,currentValue)=> currentValue(accumulator),str)

const resultStr= compositeStrFn(capitalize,reverse,wordCount)
console.log(resultStr('leinad has'))



// Composite function for Array Transformation
const compositeFnArr =
  (...fn) =>
  (number) =>
    fn.reduce((accumulator, currentValue) => currentValue(accumulator), number);

const resultArr = compositeFnArr(double, filterEven, sum);
console.log(resultArr([1, 2, 3, 4, 5, 6, 7]));
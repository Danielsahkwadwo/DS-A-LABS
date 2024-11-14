//question 1a
export const capitalize = function (str) {
  if (!str.trim()) return "please enter a string";
  if (typeof str !== "string") {
    return "please enter a valid string";
  }
  //regex to get first characters of each word
  const regex = new RegExp(/\b(\w)/g);
  //match regex and replace a capitalized version of the first letters
  const newString = str.replace(regex, (match) => match.toUpperCase());
  return newString;
};
// console.log(capitalize("this is a new day"));





// question 1b
export const reverse = function (str) {
  if (!str.trim()) return "please enter a string";
  if (typeof str !== "string") {
    return "please enter a valid string";
  }
  //split string
  const splittedString = str.split("");
  //return reversed string
  return splittedString.reverse().join("");
};
// console.log(reverse("Hello world"));






//question 1c
export const isPalindrome = function (str) {
  if (!str.trim()) return "please enter a string";
  if (typeof str !== "string") {
    return "please enter a valid string";
  }
  //return true if strings read same forward and backward and return false if not
  if (str === str.split("").reverse().join("")) {
    return true;
  } else {
    return false;
  }
};
// console.log(isPalindrome(""));







//question 1d
export const wordCount = function (str) {
  if (!str.trim()) return "please enter a string";
  if (typeof str !== "string") {
    return "please enter a valid string";
  }
  const count = str.replace(/\s/g,'').length;
  return count;
};
// console.log(wordCount(""));
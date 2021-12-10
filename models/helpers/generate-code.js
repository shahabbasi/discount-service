const numbers = [];
for (let i = 48; i < 58; i++) {
  numbers.push(String.fromCharCode(i));
}
const upperCaseChars = [];
for (let i = 65; i < 91; i++) {
  upperCaseChars.push(String.fromCharCode(i));
}
const lowerCaseChars = [];
for (let i = 97; i < 123; i++) {
  lowerCaseChars.push(String.fromCharCode(i));
}
const specials = [
  String.fromCharCode(95), // underscore
  String.fromCharCode(45) // hyphen
];
const availableChars = [].concat(numbers, upperCaseChars, lowerCaseChars, specials);
const availableCharsCount = availableChars.length;


function getCode(length, codesSet) {
  let code = '';
  for (let j = 0; j < length; j++) {
    const charIndex = Math.floor(Math.random() * availableCharsCount);
    code += availableChars[charIndex];
  }
  if (codesSet.has(code)) {
    return getCode(length, codesSet);
  }
  return code;
}

// This function can generate up to 4000B unique codes.
function generate(count, length = 7, codes = new Set()) {
  for (let i = 0; i < count; i++) {
    codes.add(getCode(length, codes));
  }
  return codes;
}


module.exports = generate;

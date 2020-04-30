const elem = document.createElement('pre');
const array = [[1], [2], [3]];

elem.innerHTML = JSON.stringify(array.flat(), null, '  ');

document.body.appendChild(elem);

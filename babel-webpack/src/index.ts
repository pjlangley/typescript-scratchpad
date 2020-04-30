import { add } from './utils';

const elem = document.createElement('div');
elem.innerHTML = `1 + 2 = ${add(1, 2)}`;

document.body.appendChild(elem);

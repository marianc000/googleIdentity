import {table} from './table.js';

fetch('api/top').then(res=>res.json()).then(data=>tableDiv.innerHTML=table(data,'Top users'));
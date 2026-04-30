import fs from 'fs';
let txt = fs.readFileSync('./public/js/dateTimePicker.js', 'utf8');
txt = txt.replace(/\\\${/g, '${');
fs.writeFileSync('./public/js/dateTimePicker.js', txt);
console.log("Fixed!");

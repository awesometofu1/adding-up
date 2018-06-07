'use strict';
//ファイルを一行読み込む
const fs = require('fs');
const readline = require('readline');
//モジュールとなるオブジェクトの呼び出し
//fs ファイルを使うためのモジュール
//readline ファイルを一行ずつ読み込むためのモジュール
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//ファイルを呼び込むためのStreamを生成し、さらにそれをreadlineオブジェクトのinputo
const map = new Map(); // key: 都道府県　value:　集計データのオブジェクト
rl.on('line', (lineString) => { 
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
   let value = map.get(prefecture);
   if (!value) { 
     value = {
       popu10: 0,
       popu15: 0,
       change: null
     };
   }
   if (year === 2010) {
     value.popu10 += popu;
   }
   if (year === 2015) {
     value.popu15 += popu;
   }
   map.set(prefecture, value);
  }
});
rl.resume();
rl.on('close', () => { 
  for (let pair of map) {
    const value = pair[1];
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    return pair2[1].change = pair1[1].change;
  });
  console.log(rankingArray);
});

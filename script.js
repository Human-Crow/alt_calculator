const resources = [730,579,712,599,725,323];
const et_ratio = [7242, 5028, 7932, 5315, 6954, 3520];
var score = 100000;

for (let i = 0; i < et_ratio.length; i++) {
    score = Math.min(score, resources[i] * 30 / et_ratio[i]);
}

console.log(score);
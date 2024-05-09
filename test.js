function text_measure(a,b) {
    let i=0;
    a=a.toLowerCase();
    b=b.toLowerCase();
    while (a[i]) {
        if (a[i]!==b[i]) return false;
        i++;
    }
    return true;
}

let strA="hello";
let strB="heLLo";

console.log(text_measure(strA,strB));
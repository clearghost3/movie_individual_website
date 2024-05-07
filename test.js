function fill_one_array(array,index) {
    while (array[index+1]!==undefined) {
        array[index]=array[index+1];
        index++;
    }
    array.pop();
    return array;
}
let a=[0,1,2,3,4,5,6];
fill_one_array(a,3)
console.log(a);
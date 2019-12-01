var kits = {};
// 封装获取本地存储的数据，默认是返回数组的
kits.localData = function(key){
    let json = localStorage.getItem(key);
    // 判断一下json是否为空，为空的话就返回空数组[] 否则返回JSON.parse(json);
 /*    if(json===null){
        arr = [];
    }else{
        arr = JSON.parse(json);
    } */
    // 简化为三元表达式
    arr = json===null?  [] : JSON.parse(json);
    return arr;
}
// 封装把数据存储到本地数据的方法
kits.saveData = function(key,data){
    let json = JSON.stringify(data);
    localStorage.setItem(key,json);
}
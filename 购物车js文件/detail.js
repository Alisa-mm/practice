// 入口函数
$(function(){
    // 先得到id
    let id = location.search.substring(4);
    // 新的数组的获取指定条件元素的方法
    let target = phoneData.find(function(e){
       return  e.pID == id;
    });
    // 把数据动态渲染到结构里面
    // 修改价格
    $('.summary-price em').text(`¥${target.price}`);
    // 修改名字内容
    $('.sku-name').text(target.name);
    // 修改图片
    $('.preview-img>img').attr('src',target.imgSrc);

    // 点击加入购物车效果的实现
    // 给添加到购物车的按钮注册点击事件
    $('.addshopcar').on('click',function(){
        // 先获取购物车的件数
        let number = $('.choose-number').val();
        // 判断一下用户加入购物车的件数
        if(number.trim().length === 0 ||number<=0 || isNaN(number)){
            alert('请输入正确的商品数量');
            return ;
        }
        // 把件数和商品的信息存储到本地数据里面,数据比较多 可以给一个数组
        // 先从本地数据中读取出一个指定的键 - 键是自己定义的
        let arr = kits.localData('cartlistdata');
        console.log(arr);
        
        // 有数组 然后就向数组里存数据了， 往数组里面存储的数据应该是一个一个的对象，每个商品都是一个对象 
        // 在传数据之前要做一个判断
        // 判断是否已经存在该商品 - 根据id判断是否已经存在
        let exist = arr.find(function(e){
           return e.pID == id ;
        });
        // 保证数量是数据  先转换一下
        number = parseInt(number);
        if(exist){
            exist.number +=number;
        }else{
            // 自己构建对象
            let obj = {
                pID: target.pID,
                imgSrc: target.imgSrc,
                name: target.name,
                price: target.price,
                number: number,
                // 保持勾选的状态的属性
                isChecked:true
            }
            arr.push(obj);
        }
        // 数据存进数组里面  然后存进本地存储
        kits.saveData('cartlistdata',arr);
        // 然后跳转到购物车页面
        location.href = './cart.html';
    })
})
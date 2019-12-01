$(function(){
    // 第一个功能： 先读取本地数据中的数据，然后动态的生成列表结构
   let arr = kits.localData('cartlistdata');
   //遍历数组 动态生成结构
   let html = '';
   arr.forEach(e=> {
    html += `<div class="item" data-id="${e.pID}">
    <div class="row">
      <div class="cell col-1 row">
        <div class="cell col-1">
          <input type="checkbox" class="item-ck" ${e.isChecked ? "checked" : ''}>
        </div>
        <div class="cell col-4">
          <img src="${e.imgSrc}" alt="">
        </div>
      </div>
      <div class="cell col-4 row">
        <div class="item-name">${e.name}</div>
      </div>
      <div class="cell col-1 tc lh70">
        <span>￥</span>
        <em class="price">${e.price}</em>
      </div>
      <div class="cell col-1 tc lh70">
        <div class="item-count">
          <a href="javascript:void(0);" class="reduce fl ">-</a>
          <input autocomplete="off" type="text" class="number fl" value="${e.number}">
          <a href="javascript:void(0);" class="add fl">+</a>
        </div>
      </div>
      <div class="cell col-1 tc lh70">
        <span>￥</span>
        <em class="computed">${e.number * e.price}</em>
      </div>
      <div class="cell col-1">
        <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
      </div>
    </div>
  </div>`
   });  
    // 手动添加到父元素中
    $('.item-list').append(html);
    // 如果arr中数据不是全部勾选的，就需要把全选的勾勾去掉
/*     let noChooseAll = arr.find(e=>{
       if(noChooseAll){
        $('.pick-all').prop('checked',false);
       }
    }); */
    let noChooseAll = arr.find(e=>{
        return !e.isChecked;
    });
    $('.pick-all').prop('checked',!noChooseAll);
   
    if(arr.length != 0){
        $('.empty-tip').hide(); // 隐藏购物车为空的提示
        $('.cart-header').show(); // 显示表头
        $('.total-of').show(); // 显示用于结算的div
    }
    //  第二个功能 全选和点选
        // 实现全选
     $('.pick-all').on('click',function(){
        let status = $(this).prop('checked');
        $('.item-ck').prop('checked',status);
        $('.pick-all').prop('checked', status);
        arr.forEach(e=>{
            e.isChecked = status;
          })
          // 重新存进本地数据
          kits.saveData('cartListData',arr);
        //  全选的时候 要更新数据
        calcTotal();
     })
    //  实现点选 因为checkbox是动态生成的 用委托来注册
    $('.item-list').on('click','.item-ck',function(){
        // 如果勾选的个数和总个数一致 就是全选了
        let ckAll = $('.item-ck').length === $('.item-ck:checked').length;
        // 设置全选的状态和ckAll 一致
        $('.pick-all').prop('checked',ckAll);
        // 把当前的数据的是否勾选记住
        let isChecked = $(this).prop('checked');
        let id = $(this).parents('.item').attr('data-id');
        arr.forEach(e=>{
            if(e.pID == id){
                e.isChecked = isChecked;
            }
        })
        kits.saveData('cartlistdata',arr);
        calcTotal();
    })

     // 封装一个计算总价格和总件数的函数，方便每次使用就调用
    function calcTotal(){
        // 第三个功能实现总数和总价的计算
        // 计算总价和总件数 是要从本地数据中获取 isChecked 为true的加起来
        let totalCount = 0;
        let totalMoney = 0;
        arr.forEach(e=>{
            if(e.isChecked){
                totalCount+= e.number;
                totalMoney+= e.number*e.price;
            }
        })
        // 把总价和件数更新到页面中去
        $('.selected').text(totalCount);
        $('.total-money').text(totalMoney);
    }
    //一开始就要计算一次
    calcTotal();
    // 第四个功能 实现数量的加减
    // 给+号按钮注册点击事件,因为整个checkbox都是动态生成的  所以用委托
    $('.item-list').on('click','.add',function(){
        let prev = $(this).prev()
         // 点击加号的时候 先获取它前一个兄弟元素 输入框
        let current = prev.val();
         // 让输入框里面的数字增加
        prev.val(++current);
        // 数量也要更新到本地数据里
        let id = $(this).parents('.item').attr('data-id');
        let _this = $(this)
        arr.forEach(e=>{
          if(e.pID == id){
            e.number = current;
          }
         $(this).parents('.item').find('.computed').text(e.number*e.price);
        })
      /*   let obj = arr.find(e=>{
          return e.pID == id;
        }); */
       /*  obj.number = current; */
        // 把数据存到本地存储
    kits.saveData('cartlistdata',arr);
    // 更新总件数和总价格
    calcTotal();
    // 更新右边的总价
    // console.log($(this).parents('.item').find('.computed')); // find这个方法用于查找某个元素的后代元素中，满足条件的部分
       /*  $(this).parents('.item').find('.computed').text(obj.number*obj.price); */
    })
    // 给减号注册事件
    $('.item-list').on('click','.reduce ',function(){
      // 先获取减号的下一个兄弟元素 输入框
      let next = $(this).next();
      let current = next.val();
      // 判断一下 当前的值是否小于等于1
      if(current<=1){
        alert('商品件数不能小于1');
        return ;
      }
      next.val(--current);
      // 数量也要更新到本地
      let id = $(this).parents('.item').attr('data-id');
      let obj = arr.find(e=>{
        return e.pID == id;
      });
      obj.number = current;
      // 存储到本地存储
      kits.saveData('cartlistdata',arr);
      // 更新总件数和总价
      calcTotal();
      // 更新右边的总价
      $(this).parents('.item').find('.computed').text(obj.number*obj.price)
    })
    // 当得到焦点的时候，把当前的值先保存起来，如果失去焦点的时候输入的结果是不合理的，我们可以恢复原来的数字
    $('.item-list').on('focus','.number',function(){
     //  把旧的 正确的数量先存储起来
      let old =$(this).val();
      $(this).attr('data-old',old);
    });
    // 当输入框失去焦点时，需要把当前的值也同步到本地数据里面
    $('.item-list').on('blur','.number',function(){
       // 对用户的输入进行验证
    let current = $(this).val();
    if(current.trim().length === 0 ||isNaN(current) || parseInt(current<=0)){
      let old = $(this).attr('data-old');
      $(this).val(old);
      alert('商品数量不正确，请输入一个阿拉伯数字');
      return;
    }
    // 如果验证通过，把总价之类的数据更新
    // 数量也要存储到本地
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e=>{
      return e.pID == id;
    });
    obj.number = parseInt(current);
    kits.saveData('cartlistdata',arr);
    calcTotal();
    // 更新右边总价
    $(this).parents('.item').find('.computed').text(obj.number * obj.price);
    });
    // 移除购物车商品
    $('.item-list').on('click','.item-del',function(){
        // 把对应的父元素item删除
        $(this).parents('.item').remove();
        calcTotal();
        // 得到当前的id
        let id = $(this).parents('.item').attr('data-id');
        arr = arr.filter(e=>{
          return e.pID != id;
        })
        // 存储到本地数据
        kits.saveData('cartlistdata',arr);
    })
   
})
    

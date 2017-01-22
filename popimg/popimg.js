/**
 * Created by Administrator on 2017/1/20.
 * js popimg
 */
(function(window,undefined){
    var timer = null;
    umd('popImg',popImg);
    function popImg(elem,option) {
        this.elem = typeof elem == 'string' ?  $(elem) : elem;
        this.option ={};//height , width , top , left 假设没有传输进来 则根据点击的小图的位置定位 及放大
        if(option) {
            for(var index in option) {
                this.option[index] = option[index];
            }
        }
        var self = this;
        for(var i = 0 ; i<this.elem.length ;i++) {
            var item = this.elem[i];
            item.onclick = function() {
                self.loadImg(item);
            }
        }
        return this;
    }
    popImg.prototype.loadImg = function(elem) {
        var childNode = children(elem,'img')[0];
        var Bimg = childNode.getAttribute('data-src');
        var H = window.innerHeight || document.documentElement.clientHeight;
        var W = window.innerWidth || document.documentElement.clientWidth;
        //小图像 的位置 pos.x pos.y
        var pos = getAbsPoint (elem);

        //放大之后的图片大小
        var Width = this.option.width || (W - 2*pos.x);
        var Height = this.option.height || Width;
        var body = document.getElementsByTagName('body')[0];
        //新建一个弹出蒙层
        var div = document.createElement('div');
        div.setAttribute('class','model-popimg-box');
        body.appendChild(div);
        //复制 头像节点 初始状态
        var copychild  = childNode.cloneNode(true);
        copychild.setAttribute('class','copychild');
        copychild.setAttribute('style','position : absolute ;z-index:1000; top : '+pos.y+'px;left:'+pos.x+'px;opacity : 1');
        body.appendChild(copychild);


        var img = new Image();
        //加载完高清图片之后 进行 动画处理（蒙层opacity 0->1 小头像 小->大 1->0 大头像 替换）
        img.onload = function() {
            //假动作
            body.appendChild(copychild);
            copychild.style.height = Height+'px';
            copychild.style.width = Width+'px';

            div.setAttribute('style','height : '+H+'px;width : '+W+'px;opacity:1');

            //狸猫换太子 大头像替换
            timer && clearTimeout(timer);
            timer = setTimeout(function(){
                div.appendChild(img);
                body.removeChild(copychild);
            },500);
            //监听 点击蒙层缩放 功能
            div.onclick = function() {
                timer && clearTimeout(timer);
                this.parentNode.removeChild(this);
                try{
                    body.removeChild(copychild);
                }catch (error){};
            }
        }
        img.setAttribute('class','popimg');
        img.setAttribute('style','position : absolute ;top : '+pos.y+'px;left:'+pos.x+'px;height : '+Height+'px;width:'+Width+'px;');
        img.src=Bimg;
    }

    //js 封装当前元素 距离文档正文 的顶部的距离 以及 距离文档正文 的左部的距离
    function getAbsPoint (e){
        var x = e.offsetLeft;
        var y = e.offsetTop;
        while(e = e.offsetParent){
            x += e.offsetLeft;
            y += e.offsetTop;
        }
        return {"x": x, "y": y};
    }
    //min query
    function $(elem,parent) {
        parent = parent ? parent : document;
        var res = [];
        if(parent.querySelectorAll) {
            res = parent.querySelectorAll(elem);
        }else {
            var styleobj = parent.styleSheets[0] || parent.createStyleSheet();
            styleobj.addRule(elem , 'wxhstyle : true');
            for(var i = 0 ; i< parent.all.length ; i++) {
                if(parent.all[i].currentStyle.wxhstyle) {
                    res.push(parent.all[i]);
                }
            }
            styleobj.removeRule('wxhstyle');
        }
        res = converListToArray(res);
        return res;
    }
    //selector children
    function children(elem,selector) {
        var children = elem.childNodes;
        var res = [];
        for(var i = 0 ; i< children.length ; i++) {
            if(children[i].nodeType == 1 && children[i] != elem) {
                if(selector) {
                    var child = $(selector , elem);
                    //js数组合并的方法 var c = a.concat(b); a.push.apply(a,b)
                    res.push.apply(res , child);
                }
            }
        }
        return res;
    }
    //nodelist =>array
    function converListToArray(nodelist) {
        var res = [];
        try{
            res = Array.prototype.splice.call(nodelist);
        }catch(error){
            for(var i= 0 ; i< nodelist.length ;i++) {
                res.push(nodelist[i]);
            }
        }
        return res;
    }
    //监听事件
    function addEvent(type , fn ) {
        window.addEventListener ? window.addEventListener(type , fn) : (window.attachEvent ? window.attachEvent(type,fn) : window[type]=fn);
    }
    //导出模块
    function umd(modulename , component) {
        switch (true){
            case  typeof module == 'object' && module.exports :
                module.exports = component;
            case typeof define == 'function' && define.amd :
                define(modulename , function(){
                    return component;
                });
            default :
                //try {//IE 8
                //    if(typeof execScript == 'object' ) execScript('var '+modulename);
                //}catch(error){};
                window[modulename] = component;
        }
    }
})(window,undefined);

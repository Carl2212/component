/**
 * Created by Administrator on 2017/1/20.
 * js popimg
 */
(function(window,undefined){

    umd('popImg',popImg);
    function popImg(elem,option) {
        console.log(elem)
        this.elem = typeof elem == 'string' ?  $(elem) : elem;
        console.log(this.elem);
        this.option ={
            width : '300px',
            height : '300px',
        };
        if(option) {
            for(var index in option) {
                this.option[index] = option[index];
            }
        }
        var self = this;
        for(var i = 0 ; i<this.elem.length ;i++) {
            var item = this.elem[i];
            item.onclick = function() {
                console.log(item);
                self.loadImg(item);
            }
        }
        return this;
    }
    popImg.prototype.loadImg = function(elem) {
        console.log(children(elem)[0].src);
        var Bimg = children(elem)[0].getAttribute('data-src');
        console.log(Bimg);
        var H = window.innerHeight || document.documentElement.clientHeight;
        var W = window.innerWidth || document.documentElement.clientWidth;
        console.log(H ,W);
        var div = document.createElement('div');
        var img = new Image();
        var self = this;
        img.onload = function() {
            div.setAttribute('class','model-popimg-box');
            div.style.height = H+'px';
            var h = (H - self.option.height.substring(0,self.option.height.length-2))/2;
            div.style.paddingTop = h+'px';
            div.appendChild(img);
            document.getElementsByTagName('body')[0].appendChild(div);
            div.onclick = function() {
                this.parentNode.removeChild(this);
            }
        }
        img.setAttribute('class','popimg');
        img.style.height = this.option.height;
        img.style.width = this.option.width;
        img.src=Bimg;

    }

    function $(elem) {
        var res = [];
        if(document.querySelectorAll) {
            res = document.querySelectorAll(elem);
        }else {
            var styleobj = document.styleSheets[0] || document.createStyleSheet();
            styleobj.addRule(elem , 'wxhstyle : true');
            for(var i = 0 ; i< document.all.length ; i++) {
                if(document.all[i].currentStyle.wxhstyle) {
                    res.push(document.all[i]);
                }
            }
            styleobj.removeRule('wxhstyle');
        }
        res = converListToArray(res);
        return res;
    }
    function children(elem) {
        var children = elem.childNodes;
        var res = [];
        for(var i = 0 ; i< children.length ; i++) {
            if(children[i].nodeType == 1 && children[i] != elem) {
                res.push(children[i]);
            }
        }
        return res;
    }
    function converListToArray(nodelist) {
        console.log(nodelist);
        var res = [];
        try{
            res = Array.prototype.splice.call(nodelist);
        }catch(error){
            for(var i= 0 ; i< nodelist.length ;i++) {
                res.push(nodelist[i]);
            }
        }
        console.log(res);
        return res;
    }
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

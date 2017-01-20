/**
 * Created by wxh on 2017/1/16.
 * 改良版的延迟加载
 */
(function(window,underfined){

    umd('lazyload',lazyload);
    lazyload.SENCER = 30;
    //声明
    function lazyload(elem , option) {
        //当前类型是选择器
        this.elem = typeof elem == 'string' ? $(elem) : elem;
        console.log(elem);
        this.tag="data-src";
        this.img_id =false;//图片加载之后id
        this.callback = false;//图片加载之后执行函数
        this.distance = 0;//加载距离可视区域内xpx的图片
        this._pause = false;

        var option = option || [];
        for(var i in option) {
            this[i] = option[i];
        };
        var me = this;
        setTimeout(function(){
            me.init();
        },4);
    }
    lazyload.prototype.init = function() {
        this._detectElementIFInScreen();

        var timer;
        var me = this;
        addEventListener('scroll',function(){
            //清除还未开始的加载保证性能
            timer && clearTimeout(timer);
            setTimeout(function(){
                me._detectElementIFInScreen();
            },lazyload.SENCER);
        });
        addEventListener('resize', function () {
            //清除还未开始的加载保证性能
            timer && clearTimeout(timer);
            setTimeout(function(){
                me._detectElementIFInScreen();
            },lazyload.SENCER);
        });

    }

    lazyload.prototype.pause = function() {
        this._pause = true;
        return this;
    }
    lazyload.prototype.restart = function() {
        this._pause = false;
        this._detectElementIFInScreen();
        return this;
    }

    lazyload.prototype._detectElementIFInScreen = function() {
        if(!this.elem.length || this._pause) {
            this._pause = false ;
            return;
        }
        var H = window.innerHeight || document.documentElement.clientHeight;
        var W = window.innerWidth || document.documentElement.clientWidth;
        console.log(this.elem);
        for(var i = 0 ,len =this.elem.length ; i < len ; i++ ) {
            var elem = this.elem[i];
            var rect = elem.getBoundingClientRect();
            console.log(rect);
            if((rect.left >= this.distance && rect.top >= this.distance
                    ||rect.top < 0 && (rect.top+this.elem.height) >= this.distance
                    ||rect.left < 0 && (rect.left+this.elem.width) >= this.distance
                )&& rect.top <= H && rect.left <= W) {
                this.loadItems(elem);
                this.elem.splice(i,1);
                i--;len--;
            }
        }
        //全部图片加载完 回调
        if(!this.elem.length) {
            this.callback && this.callback();
        }
    }

    lazyload.prototype.loadItems = function(elem) {
        //懒性加载图片
        var imgs = elem.getElementsByTagName('img');
        for(var i = 0 ; i< imgs.length ; i++) {
            imgs[i].setAttribute('src',imgs[i].getAttribute(this.tag));
        }
        //懒性加载textarea
        var text = elem.getElementsByTagName('textarea');
        for(var j = 0 ; j< text.length ; j++) {
            var value = text[j].value;
            if(window.execScript) {
                window.execScript(value);
            }else{
                new funciton(value)();//???
            }
        }
    }
    function addEventListener(event,fn) {
        //谷歌火狐IE9+使用window.addEventListener,Ie678用window.attachEvent否则用window.onevent = fn;
        window.addEventListener ? this.addEventListener(event,fn) : (window.attachEvent)? this.attachEvent('on'+event,fn) : this['on'+event] = fn;
    }
    //min Query
    function $(elem) {
        var res = [];
        if(document.querySelectorAll) {//IE8及以上及火狐谷歌 支持这个方法
            res = document.querySelectorAll(elem);
        }else{
            var styleobj = document.styleSheets[0] || document.createStyleSheet();
            styleobj.addRule(elem , 'Sticket : true');
            for(var i = 0 ; i <= document.all.length ;i++) {
                var item = document.all[i];
                if(item.currentStyle.Sticket) {
                    res.push(item);
                }
            }
            styleobj.removeRule('Sticket');
        }
        res = convertListToArray(res);
        return res;
    }
    //将nodelist转化为array
    function convertListToArray(nodes) {
        var array = null;
        try{
            array = Array.prototype.slice.call(nodes,0);
        }catch(ex){//IE8以下不支持Array.prototype.slice ，所以使用遍历转化
            array = new Array();
            for(var i = 0,len = nodes.length;i < len;i++) {
                array.push(nodes[i]);
            }
        }
        return array;
    }
    //umd
    function umd(name,component) {
        switch (true) {
            case  typeof module === 'object' && !!module.exports ://vuejs等使用es6的import导入
                module.exports = component;
                break;
            case typeof define === 'function' && !!define.amd ://seajs
                define(name,function(){
                    return component;
                });
            default :
                //try {//IE 8
                //    if(typeof execScript == 'object' ) execScript('var '+name);
                //}catch(error){};
                window[name] = component;
        }
    }

})(window);

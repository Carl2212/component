/**
 * Created by wxh on 2017/1/16.
 * 改良版的延迟加载
 */
(function(window,underfined){

    //声明
    function lazyload(elem , option) {
        //当前类型是选择器
        this.elem = typeof elem == 'string' ? $(elem) : elem;


        this.lazy_src ="data-src",
        this.img_id =false,//图片加载之后id
        this.callback = false,//图片加载之后执行函数
        this.distance = false//false为对象下全部图片进行加载。否则加载距离可视区域内xpx的图片

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


    }

    lazyload.prototype._detectElementIFInScreen = function() {

    }

    lazyload.prototype.loadItems = function() {

    }
    //min Query
    function $(elem) {
        var res = [];
        if(document.querySelectorAll) {
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
        }
        if(res.item) {//iE 8
            var ret = [];
            for(var j = 0 ;j < res.item.length ; j++) {
                ret.push(res.item(i));
            }
            res = ret;
        }
        return res;
    }


})(window);

/**
 * Created by wxh on 2016/4/16.
 * 插件作用：
 * 延时加载图片 并在加载结束后执行函数
 */
(function($){
    $.fn.lazyload = function(option){
        option=$.extend({
            lazy_src :"lazy_src",
            img_id : false,//图片加载之后id
            callback : false,//图片加载之后执行函数
            load_num : false//false为对象下全部图片进行加载。否则加载对应几张
        },option);
        var BROWSER = function() {
            var ua = navigator.userAgent.toLowerCase();

            var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                !/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
                [];

            return { browser: match[1] || "", version: match[2] || "0" };
        }();
        return this.each(function(){
            var obj = $(this).find('img');
            var num = option.load_num ? option.load_num :obj.length;
            for(var i = 0; i< num; i++){
                (function(_this){
                    //是路径还是属性
                    var rag = /[\.png|\.jpg]/gi;
                    var lazy_src = rag.test(option.lazy_src)  ? option.lazy_src : _this.attr(option.lazy_src);
                    if(lazy_src !== undefined) {
                        var img = new Image();
                        if(option.callback) {
                            //兼容拓展
                            if(BROWSER.browser == 'msie'){
                                img.onreadystatechange = function(){
                                    if(img.readyState == "complete" || img.readyState == "loaded"){
                                        option.callback(_this,img);
                                    }
                                };
                            }else if(BROWSER.browser == 'mozilla'){
                                img.onload = function(){
                                    if(img.complete == true){
                                        option.callback(_this,img);
                                    }
                                }
                            }else{
                                img.onload = function(){
                                    option.callback(_this,img);
                                }
                            }
                        }
                        img.src = lazy_src;
                        if(option.img_id) {
                            img.id = option.img_id;
                        }
                    }else{
                        option.callback(_this);
                    }
                })($(obj[i]));
            }
        });
    };
})(jQuery);

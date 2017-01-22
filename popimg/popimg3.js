/**
 * Created by Administrator on 2017/1/20.
 * jquery popimg 将样式移入 js 因此对于css3过渡效果无用transition 使用jquery动画替换
 */
(function($ , undefined){
    $.fn.popimg = function(option){
        option = $.extend({},option);//height , width , top , left 假设没有传输进来 则根据点击的小图的位置定位 及放大
        var timer = null;
        //新建一个弹出蒙层 全局静态
        var $layer = $('<div/>').css({
            position: 'absolute',
            top : 0,
            width: '80px',
            height : '80px',
            zIndex: 999,
            background : 'rgba(100,100,100,.8)',
            cursor: 'zoom-out',
        }).addClass('model-popimg-box');
        //复制一个节点
        var copyImg = function(elem){
            var pos = {x : elem.offset().left , y : elem.offset().top};
            var cimg = elem.clone().css({
                position : 'absolute' ,
                zIndex:1000,
                top : pos.y+'px',
                left: pos.x+'px',
                opacity : 1,
                width: '80px',
                height : '80px',
            }).addClass('copychild');
            return cimg;
        };
        //加载图片
        var loadImg = function(elem) {
            //复制 头像节点 初始状态
            $('body').append($layer).append(copyImg(elem.children('img')));

            var img = new Image();
            //加载完高清图片之后 进行 动画处理（蒙层opacity 0->1 小头像 小->大 1->0 大头像 替换）
            img.onload = function() {
                $layer.append(img);
                justfyimg(elem);
            }
            $(img).addClass('popimg').css('opacity' , 0 );
            img.src = elem.children('img').attr('data-src');
        }
        //调整图片大小 动画
        var justfyimg = function(elem) {
            var H = $(window).height();
            var W =$(window).width();
            var pos = {x : elem.offset().left , y : elem.offset().top};
            var Width = option.width || (W - 2*pos.x);
            var Height = option.height || Width;

            var body = $('body');
            var copychild = $('body .copychild');
            var model = $('body .model-popimg-box');
            var popimg = model.children('.popimg');

            //假动作
            copychild && copychild.stop().animate({
                height : Height+'px',
                width : Width+'px'
            },500);
            model.css({'height' : H+'px','width' :W +'px'}).fadeIn(500);

            //狸猫换太子 大头像替换
            timer && clearTimeout(timer);
            timer = setTimeout(function(){
                popimg.css({
                    position : 'absolute',
                    opacity : 1 ,
                    top : pos.y+'px',
                    left:pos.x+'px',
                    height : Height+'px',
                    width:Width+'px'
                });
                copychild && copychild.remove();
            },500);
            //监听 点击蒙层缩放 功能
            model.on('click',function(){
                zoomOut();
            });
        }
        //缩小
        var zoomOut = function(){
            var model = $('body .model-popimg-box');
            var copychild = $('body .copychild');
            timer && clearTimeout(timer);
            model.fadeOut(300).children().remove();
            try{
                copychild && copychild.remove();
            }catch (error){};
        }
        //主函数
        return this.each(function(){
            var self = $(this);
            $(this).css('cursor','zoom-in').on('click',function(){
                loadImg($(this));
            });
            $(window).on('resize',function(){
                if($('.model-popimg-box')) {
                    justfyimg(self);
                }
            });
            $(window).on('click keydown',function(e){
                console.log(e.type ,e.keyCode   );
                if(e.type =='keydown' && e.keyCode == 27){//按下键盘ESC 退出
                    zoomOut();
                }
            });
            return this;
        });
    };
})(jQuery,undefined);

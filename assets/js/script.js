// Window Scroll
var windowScroll = function () {
    $(window).scroll(function () {

        var scrollPos = $(this).scrollTop();
        
        var system ={win : false,mac : false,xll : false};
        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        //判断平台类型
        if(system.win||system.mac||system.xll){
            if ($(window).scrollTop() > 70)
            {
                $('.site-header').addClass('site-header-nav-scrolled');
                $('.icon-logo').addClass('site-header-nav-scrolled');

            } else {
                $('.site-header').removeClass('site-header-nav-scrolled');
                $('.icon-logo').removeClass('site-header-nav-scrolled');

            }
        }else{
            //如果是手机则将顶栏移除界面
            if ($(window).scrollTop() > 40) 
            {
                $('.site-header').addClass('site-header-nav-scrolled-ph');
            } else {
                $('.site-header').removeClass('site-header-nav-scrolled-ph');
            }
        }
 });
};

function headerSubmenu() {
    $('.site-header-nav').find('.site-header-nav-item').each(function() {
        $(this).hover(function() {
            $(this).find('.submenu').show()
        }, function() {
            $(this).find('.submenu').hide()
        })
    })
};

function toc() {
    /*可通过下列语句判断是否生成了目录(有的文章内容短无目录)*/
    if (typeof $('#markdown-toc').html() === 'undefined') {
        //...
    }else {
        /*将其显示在侧边栏*/
        $('.sidebar_catelog').html('<ul class="list_catelog">' + $('#markdown-toc').html() + '</ul>');
    }
}

function locateCatelogList(){
    /*获取文章目录集合,可通过：header过滤器*/
    var alis = $('.list_catelog li ul li');
    /*获取侧边栏目录列表集合**/
    var sidebar_alis = $('.sidebar_catelog').find('a');
    /*获取滚动条到顶部的距离*/
    var scroll_height = $(window).scrollTop();
    for(var i =0;i<alis.length;i++){
        /*获取锚点集合中的元素分别到顶点的距离*/
        var a_height = $(alis[i]).offset().top;
        if (a_height<scroll_height){
            /*高亮显示*/
            sidebar_alis.removeClass('list_click');
            $(sidebar_alis[i]).addClass('list_click');
        }
    }
}

$( document ).ready(function() {
    windowScroll();
    headerSubmenu();
    toc()
});

$(function() {
    /*绑定滚动事件 */
    $(window).bind('scroll',locateCatelogList);
});




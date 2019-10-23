// Window Scroll
var windowScroll = function () {
    $(window).scroll(function () {

        var scrollPos = $(this).scrollTop();
        
        var system ={win : false,mac : false,xll : false};
        //���ƽ̨
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        //�ж�ƽ̨����
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
            //������ֻ��򽫶����Ƴ�����
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
    /*��ͨ����������ж��Ƿ�������Ŀ¼(�е��������ݶ���Ŀ¼)*/
    if (typeof $('#markdown-toc').html() === 'undefined') {
        //...
    }else {
        /*������ʾ�ڲ����*/
        $('.sidebar_catelog').html('<ul class="list_catelog">' + $('#markdown-toc').html() + '</ul>');
    }
}

function locateCatelogList(){
    /*��ȡ����Ŀ¼����,��ͨ����header������*/
    var alis = $('.list_catelog li ul li');
    /*��ȡ�����Ŀ¼�б���**/
    var sidebar_alis = $('.sidebar_catelog').find('a');
    /*��ȡ�������������ľ���*/
    var scroll_height = $(window).scrollTop();
    for(var i =0;i<alis.length;i++){
        /*��ȡê�㼯���е�Ԫ�طֱ𵽶���ľ���*/
        var a_height = $(alis[i]).offset().top;
        if (a_height<scroll_height){
            /*������ʾ*/
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
    /*�󶨹����¼� */
    $(window).bind('scroll',locateCatelogList);
});




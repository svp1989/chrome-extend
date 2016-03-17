$(function(){
    // устанавливаем новый popup пишим сообщение и логин
    var bgw = chrome.extension.getBackgroundPage();
    $('#find').html('Вы авторизованны: <span>' + bgw.bg.data.login + '</span>');
});




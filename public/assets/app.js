$(document).ready(function () {
    $.get('api/gender/Male', function (words) {
        $('.male').jQCloud(words, {
            width: 500,
            height: 350
        });
    });

    $.get('api/gender/Female', function (words) {
        $('.female').jQCloud(words, {
            width: 500,
            height: 350
        });
    });
})
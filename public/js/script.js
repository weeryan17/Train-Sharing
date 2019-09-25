$(document).ready(function () {
    $("*[data-elmlink]").click(function (e) {
        var elm = $(e.currentTarget);
        console.log(elm.attr("data-elmlink"));
        window.location.href = elm.attr("data-elmlink");
    });
});
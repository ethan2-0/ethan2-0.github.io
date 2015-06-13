(function() {
    // +==========+
    // | Titlebar |
    // +==========+
    $(".titlebar-item").on("click", function() {
        active = $(this);
        console.log($(this).height());
        $("#titlebar-underline")
            .css("width", $(this).width() + 38) //38 from 19*2, 19 being padding on every side for titlebar-item's
            .css("left", $(this).offset().left)
            .css("top", $(this).height() + 30); //Same 38, -8 for its height
        pages.loadPage($(this).attr("goes-to"));
    });
    var active;
    if(false || window.location.hash == "") {
        active = $($(".titlebar-item")[0]);
    } else {
        active = $(".titlebar-item[goes-to=" + window.location.hash.replace("#", "") + "]");
        console.log(active);
    }
    $(function() {
        active.trigger("click"); //HACK
    });
})();
var pages = (function() {
    // +=========+
    // |  Pages  |
    // +=========+
    function loadPage(name) {
        $(".page").each(function() {
            if($(this).attr("page") == name) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        history.pushState("", "Navigated to: " + name, "#" + name);
    }
    return {
        loadPage: loadPage
    }
})();
(function() {
    // +==========+
    // | UI Stuff |
    // +==========+
    $(".page-title-hero").attr("data-stellar-background-ratio", "0")
        .each(function() {
            $(this).css("background-image", "url(images/" + $(this).attr("image")) + ")";
            if($(this).attr("offsetx")) {
                $(this).attr("data-stellar-vertical-offset", $(this).attr("offsetx"));
            }
        });
})();
//Init Stellar.js
//Note to self: data-stellar-vertical-offset
$(window).stellar();
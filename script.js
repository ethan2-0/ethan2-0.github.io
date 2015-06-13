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
    var active = $($(".titlebar-item")[0]);
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
    }
    return {
        loadPage: loadPage
    }
})();
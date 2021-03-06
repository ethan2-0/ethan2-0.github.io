/*
    Copyright (c) 2015 Ethan White.
    All rights reserved.

    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following
    conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer
    in the documentation and/or other materials provided with the distribution.

    3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived
    from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
    NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
    THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
    HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
    ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//Helper function. Thanks Nikolas B. @ https://stackoverflow.com/questions/9957827/.
function getMatchIndices(regex, str) {
    var result = [];
    var match;
    regex = new RegExp(regex);
    while (match = regex.exec(str)) {
        result.push(match.index);
    }
    return result;
}
String.prototype.contains = function(s) {
    return this.indexOf(s) !== -1;
}
//"This is an id()" -> "thisisanid"
function reduceId(id) {
    var chars = " -.?+-*/(){}&^%$#@!";
    id = id.toLowerCase();
    for(var i = 0; i < chars.length; i++) {
        id = id.split(chars[i]).join("");
    }
    return id;
}
//Get the last element of an array
function last(arr) {
    return arr[arr.length - 1];
}
(function() {
    // +==========+
    // | Markdown |
    // +==========+
    var converter = showdown.Converter();
    $("markdown").each(function() {
        var currText = $(this).html();

        //This requires some explanation.
        //Markdown parses anything that's indentented significantly as a code block, which we don't want,
        //since things are conventionally indented in HTML.
        var indentation = 0;
        //This for loop goes over the initial "\n" + a whole bunch of indentation to figure out how deep we're indented.
        for(;" \n".contains(currText[indentation]); indentation++);
        //Subtract one from indentation.
        //Note we'd normally not need to subtract one from indentation, but the for loop counts the newline,
        //(i.e. <markdown>__\n__...</markdown>), so we have one added, which is not what we want; so, we decrement by one:
        indentation--;
        var newText = currText.split("\n");
        var newerText = ""
        for(var line of newText) {
            newerText += line.substr(indentation) + "\n";
        }
        console.log(newerText);

        $(this).html(converter.makeHtml(newerText));

        // Now, pull out the headings, subheadings, etc.
        // This should be done recursively, but I'm too lazy to put that much thought into it.
        // Besides, there are only 3 types of heading I'll actually be using, so this is about
        // as long as the recursive implementation.
        // (I'm pretty sure this is complex recursive)
        if($(this).attr("table-of-contents") != undefined) {
            var tree = {};
            var currElm = null;
            var currElm2 = null;
            $(this).children().each(function() {
                var child = $(this);
                if(child.is("h1")) {
                    tree[child.html()] = {};
                    currElm = tree[child.html()];
                } else if(child.is("h2")) {
                    currElm[child.html()] = [];
                    console.log(currElm);
                    currElm2 = currElm[child.html()]
                } else if(child.is("h3")) {
                    currElm2.push(child.html());
                }
            });
            var outlineElm = $($(this).attr("table-of-contents"));
            function doStuff(tree, padding) {
                var isArray = (typeof tree.push) != "undefined"
                if(typeof padding == "undefined") {
                    padding = 0;
                }
                for(var key in tree) {
                    var value = tree[key];
                    var currElm = $("<div>")
                        .html(isArray ? value : key)
                        .addClass("outline-elm")
                        .css("padding-left", padding)
                        .attr("reducedId", reduceId(isArray ? value : key))
                        .on("click", function(evt) {
                            $("#" + $(this).attr("reducedId")).velocity("scroll");
                            evt.stopPropagation();
                            return false;
                        })
                        .appendTo(outlineElm);
                    if(!isArray) {
                        doStuff(tree[key], padding + 15);
                    }
                }
            }
            doStuff(tree);
            console.log(JSON.stringify(tree, null, 4));
        }
    });
})();
(function() {
    // +==========+
    // | Titlebar |
    // +==========+
    $(".titlebar-item").on("click", function() {
        active = $(this);
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
            console.log("url(images/" + $(this).attr("image") + ")");
            $(this).attr("style", "background-image: url(images/" + $(this).attr("image")) + ")";
            if($(this).attr("offsetx")) {
                $(this).attr("data-stellar-vertical-offset", (parseInt($(this).attr("offsetx")) + 500) + "");
            }
        });
})();
//Init Stellar.js
$(window).stellar();
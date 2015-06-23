// Copyright (c) 2015 Ethan White.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following
// conditions are met:
// 
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
// 
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the distribution.
// 
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived
// from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
// NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/*

Some things to note:
 * When we set the property "oldDisplay" on a node, what that's doing is
   caching what its display was before it got hidden, so that we can restore
   that when we make it visible again.
 * Pager.initialized is the complement of the dirty bit on the page cache.
   What that means is it's the opposite of whether the page cache needs to be
   regenerated; that is, when Pager.initialized === false, the page cache must
   be regenerated (or generated, if it's the first time).
 * The page cache is the cache of the pages that have been found. I didn't want
   to thrash the DOM every time a page gets loaded. I probably could have also
   done it with a custom CSS selector, but I *think* that this is faster.

*/
function Pager(pageName, option) {
    if(option == "hashTrumpsName") {
        if(window.location.hash != "" && window.location.hash != "#") {
            pageName = window.location.hash.replace("#", "");
        }
    }
    if(Pager.initialized !== true) {
        console.log("Pager", "Generating page cache");
        Pager.pageCache = {};
        Pager.pageKeys = [];
        var pages = document.getElementsByClassName("page");
        for(var i = 0; i < pages.length; i++) {
            var page = pages[i];
            Pager.pageCache[page.getAttribute("page")] = page;
            Pager.pageKeys.push(page.getAttribute("page"));
        }
        Pager.initialized = true;
    }
    // Did we find the page we were looking for? If not, print out a warning later.
    var foundIt = false;
    // Loop through all of the pages. Hide all of the pages we don't want to see
    // (i.e. those whose name != pageName), and show the page we want to see.
    for(var i = 0; i < Pager.pageKeys.length; i++) {
        var key = Pager.pageKeys[i];
        var page = Pager.pageCache[key];
        if(key == pageName) {
            foundIt = true;
            if(typeof page.oldDisplay === "undefined") { // If page.oldDisplay is false, then this is the first time through, so remember it.
                // Do nothing, since this is the first time through; but, cache it.
                page.oldDisplay = page.style.display;
            } else { // Otherwise, just set it back.
                page.style.display = page.oldDisplay;
            }
        } else {
            if(page.style.display !== "none") { // If the page isn't already hidden, we want to update (or or remember for the first time) oldDisplay.
                page.oldDisplay = page.style.display;
            }
            page.style.display = "none";
        }
    }
    if(option !== "hashTrumpsName") {
        window.history.pushState("", "To page " + pageName, "#" + pageName);
    }
    if(!foundIt) {
        console.warn("Requested to load (or loading from hash) nonexistant page '" + pageName + "'.");
    }
}
Pager.cfg = {};
Pager.cfg.ignorePopState = false;
window.addEventListener("popstate", function() {
    if(!Pager.cfg.ignorePopState && window.location.hash !== "" && window.location.hash !== "#") {
        Pager("", "hashTrumpsName");
    }
});
// When pager is first called, it needs to regenerate the page cache.
Pager.initialized = false;
Pager.regenerateCache = function() {
    // Next time Pager is called, it will regenerate the page cache.
    Pager.initialized = false;
}
(function () {
    "use strict";

    //Initialize syntax highlighting
    hljs.initHighlightingOnLoad();

    //Init view logic.
    $(function() {

        const btnInflate = $("#btnInflate");
        const btnClear = $("#btnClear");
        const tbUrl = $("#tbUrl");
        const output = $(".output #displayBox");
        const lambda = '<span class="bold">&nbsp;=>&nbsp;</span>';

        btnInflate.click(function() {
            if (isUrlValid()) {
                var url = getUrl();
                $.get("/api/inflate?url={url}".replace("{url}", url))
                .done(function(response) {
                    if (response.success) {
                        output.append(`<div>${response.data.requestedUrl} ${lambda}  ${response.data.inflatedUrl}</div>`);
                    } else {
                        output.append(`<div>Something went wrong with url "${url}".</div>`);
                    }
                })
                .fail(function(xhr) {
                    output.append(`<div>XmlHttpRequestError ${lambda} ${xhr.statusText} </div>`);
                });
            }
        });

        btnClear.click(function() {
            output.html("");
        });
        
        function isUrlValid() {
            return getUrl() !== "";
        }

        function getUrl() {
            return tbUrl.val().trim();
        }

    });    
})();
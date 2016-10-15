(function () {
    "use strict";

    //Initialize syntax highlighting
    hljs.initHighlightingOnLoad();

    //Init view logic.
    $(function() {

        const BTN_INFLATE = $("#btnInflate");
        const BTN_COPY = $("#btnCopy");
        const BTN_CLEAR = $(".clear");
        const TB_URL = $("#tbUrl");
        const OUTPUT = $("#tbResult");
        const LAMBDA = '<span class="bold">&nbsp;=>&nbsp;</span>';
        const ID_BTN_CLEAR_URL = "btnclearurl";
        const ID_BTN_CLEAR_OUTPUT = "btnclearoutput";

        BTN_INFLATE.click(function() {
            if (hasUrlText()) {
                var url = getUrl();
                $.get("/api/inflate?url={url}".replace("{url}", url))
                .done(function(response) {
                    OUTPUT.css("color", "black");
                    if (response.success) {
                        OUTPUT.val(response.data.inflatedUrl);
                    } else {
                        OUTPUT.append(url);
                    }
                })
                .fail(function(xhr) {
                    OUTPUT.css("color", "red");
                    OUTPUT.append(`XmlHttpRequest Error: ${xhr.statusText}`);
                });
            }
        });

        BTN_CLEAR.click(function() {
            OUTPUT.html("");
        });

        BTN_COPY.click(function() {
            OUTPUT.select();
            if (document.execCommand) {
                document.execCommand("copy");
            }
        });

        BTN_CLEAR.click(function() {
            //Get the ID of the clicked button.
            var id = $(this).prop("id").toLowerCase();

            switch (id) {
                case ID_BTN_CLEAR_URL:
                    TB_URL.val("").focus();
                    break;
                case ID_BTN_CLEAR_OUTPUT:
                    OUTPUT.val("");
                    break;
                default:
                    break;
            }
        });
        
        function hasUrlText() {
            return getUrl() !== "";
        }

        function getUrl() {
            return TB_URL.val().trim();
        }

    });    
})();
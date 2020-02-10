$(document).ready(function () {
    const descriptionArea = $("#description")[0];
    var simplemde = new SimpleMDE({
        element: descriptionArea,
        renderingConfig: {
            codeSyntaxHighlighting: true
        }
    });
});
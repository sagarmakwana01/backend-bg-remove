$(document).ready(function () {
    $("#multiplefileupload").fileinput({
        'theme': 'fa',
        'uploadUrl': '#',
        showRemove: true,
        showUpload: false,
        showZoom: true,
        showCaption: false,
        dropZoneEnabled: false,
        browseClass: "btn btn-primary",
        browseLabel: "Select Stickers",
        browseIcon: "<i class='fa fa-plus'></i>",
        overwriteInitial: true, // Ensure it doesn't keep old files
        initialPreview: [], // No preloaded files
        initialPreviewConfig: [],
        initialPreviewAsData: true,
        fileActionSettings: {
            showUpload: false,
            showZoom: true,
        }
    })
    
});

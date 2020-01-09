
_fileUploader = function () {

    'use-strict';
    //Example 2
    $("#filer_input2").filer({
        limit: null,
        maxSize: null,
        extensions: null,
        changeInput: '<div class="grid-block align-center jFiler-input-dragDrop"><div class="grid-block align-center jFiler-input-inner"><div class="small-12 medium-12 large-12 xlarge-12 grid-content jFiler-input-icon"><div class="icon" data-icon="&#xe072;"></div></div><div class="small-12 medium-12 large-12 xlarge-12 grid-content jFiler-input-text"><h3>فایل های خود را برای بارگزاری به اینجا بکشید</h3><div>و یا</div></div><div class="small-12 medium-12 large-12 xlarge-12 grid-content"><div class="grid-block align-center"><a class="small-12 medium-6 large-2 xlarge-2 grid-content btnAddFile" style="display: block; position: relative; margin: 5px; clear: both;">انتخاب فایل ها</a></div></div></div></div>',
        showThumbs: true,
        theme: "dragdropbox",
        templates: {
            box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
            item: '<li class="jFiler-item">\
                        <div class="jFiler-item-container">\
                            <div class="jFiler-item-inner">\
                                <div class="jFiler-item-thumb">\
                                    <div class="jFiler-item-status"></div>\
                                    <div class="jFiler-item-info">\
                                        <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name | limitTo: 25}}</b></span>\
                                        <span class="jFiler-item-others">{{fi-size2}}</span>\
                                    </div>\
                                    {{fi-image}}\
                                </div>\
                                <div class="jFiler-item-assets jFiler-row">\
                                    <ul class="list-inline pull-left">\
                                        <li>{{fi-progressBar}}</li>\
                                    </ul>\
                                    <ul class="list-inline pull-right">\
                                        <li><a class="icon jFiler-item-trash-action" data-icon="&#xe0da;"></a></li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </li>',
            itemAppend: null,
            progressBar: '<div class="bar"></div>',
            itemAppendToEnd: false,
            removeConfirmation: true,
            _selectors: {
                list: '.jFiler-items-list',
                item: '.jFiler-item',
                progressBar: '.bar',
                remove: '.jFiler-item-trash-action'
            }
        },
        dragDrop: {
            dragEnter: null,
            dragLeave: null,
            drop: null,
        },
        uploadFile: {
            url: "./php/upload.php",
            data: null,
            type: 'POST',
            enctype: 'multipart/form-data',
            beforeSend: function () { },
            success: function (data, el) {
                var parent = el.find(".jFiler-jProgressBar").parent();
                el.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                    $("<div class=\"jFiler-item-others text-success\"><span class=\"icon\" data-icon=\"&#xe15f;\"></span> Success</div>").hide().appendTo(parent).fadeIn("slow");
                });
            },
            error: function (el) {
                var parent = el.find(".jFiler-jProgressBar").parent();
                el.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                    $("<div class=\"jFiler-item-others text-error\"><span class=\"icon\" data-icon=\"&#xe13b;\"></span> Error</div>").hide().appendTo(parent).fadeIn("slow");
                });
            },
            statusCode: null,
            onProgress: null,
            onComplete: null
        },
        files: [],
        addMore: false,
        clipBoardPaste: true,
        excludeName: null,
        beforeRender: null,
        afterRender: null,
        beforeShow: null,
        beforeSelect: null,
        onSelect: null,
        afterShow: null,
        onRemove: function (itemEl, file, id, listEl, boxEl, newInputEl, inputEl) {
            var file = file.name;
            $.post('./php/remove_file.php', { file: file });
        },
        onEmpty: null,
        options: null,
        captions: {
            button: "Choose Files",
            feedback: "Choose files To Upload",
            feedback2: "files were chosen",
            drop: "Drop file here to Upload",
            removeConfirmation: "آیا از حذف اطمینان دارید?",
            errors: {
                filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
                filesType: "Only Images are allowed to be uploaded.",
                filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.",
                filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB."
            }
        }
    });

}
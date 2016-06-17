---
layout: post
title: "Drag and Drop with preview using HTML5"
description: ""
category:
tags: []
---
{% include JB/setup %}

Here is a simple tutorial on implementing a drag and drop functionality using HTML5. We will also have a preview of the dropped image. Here I am using only image file but you can use any sort of files according to your requirement.

We are using HTML5's file apis to create the preview of the image we are dropping. So if the browser doesn't have support for this api then you need to use latest version of your browser. All the latest browsers have support for File apis.

First step is to create a drop area in the web page.

    ...
    <div class="drag-and-drop">
        <output id="preview"></output>
        <div id="droparea"><em>Drop Your Photos Here</em></div>
    </div>
    ...

"output" element displays the preview of the image we are dropping. Of course you need to do some css styling to make this looks like something where we can drop our images. Once you have added the [css](https://raw.github.com/deepakkumarnd/mylabs/master/drag_and_drop/drag_and_drop.css) just open the html page in a browser.

Next step is to add the event listeners to the "droparea".

    ...
    var droparea = document.getElementById('droparea');
    droparea.addEventListener('dragover', handleDragOver, false);
    droparea.addEventListener('drop', handleFileSelect, false);

    handleDragOver: function(evt){
        evt.stopPropagation();
    	evt.preventDefault();
    	evt.dataTransfer.dropEffect = "copy";
    },

    handleFileSelect: function(evt){
    	evt.stopPropagation();
    	evt.preventDefault();
    	var files = evt.dataTransfer.files;
    	var output = [];

    	for (var i=0, f; f=files[i]; i++){
    	    if (!f.type.match('image.*')) { continue; }
    	    DragAndDrop.setPreview(f);
    	}
    },
    ...

handleDragOver and handleFileSelect are the functions handling 'dragover' and 'drop' events. In handleFileSelect we sets the preview using HTML5 FileReader api.

    ...
    setPreview: function(image){
        var reader = new FileReader();
    	reader.onload = (function(theFile) {
                return function(e) {
    		        var span = document.createElement('span');
    		        span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name),
    				  '"/><a class="close" href="javascript:void(0)">x</a>'].join('');
    		        DragAndDrop.preview.insertBefore(span, null);
                };
    	})(image);

    	reader.readAsDataURL(image);
    },
    ...

Here is the [javascript](https://raw.github.com/deepakkumarnd/mylabs/master/drag_and_drop/drag_and_drop.js) I used for doing drag and drop. The code is self explanatory. When the page loads an alert will be shown if your browser doesn't support HTML5 file apis. The page will be initialized on load to respond to "dragover" and "drop" events. Once you select files drags them and dropped to the drop area, the files can be accessed in handleDragOver function as below.

    var files = evt.dataTransfer.files;

To show the preview a FileReader object is created, which then reads the file and displays it in "output" section. A close button is also displayed so that you can remove the selected image from the page.

[Here is the complete source code for this tutorial](https://github.com/deepakkumarnd/mylabs/tree/master/drag_and_drop)
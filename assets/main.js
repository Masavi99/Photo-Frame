window.mobileCheck = function() {
    let check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|iPhone|iPad|iPod|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var ratioCanWin = (mobileCheck() == true) ? 0.5 : 0.2;
var defaultWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var cw = (defaultWidth * ratioCanWin) > 350 ? (defaultWidth * ratioCanWin) : 350;
var canvas = new fabric.Canvas('canva', {
    width: cw,
    height: cw / 350 * 350
});
var filename = 'filename.png';
var imgMultiplier = 1;
var imgRatio = 1;
var ocw = cw;
var och = cw / 350 * 350;

/** Convert canvas to png and download it to local
 * format       : image file format (png)
 * imgMultiplier: ratio to original overlay image dimension
 */
window.downloadCanvas = function() {
    console.log("downloadCanvas called");  // Debugging log
    var link = document.createElement('a');
    link.download = filename + '.png';
    link.href = canvas.toDataURL({
        format: 'png',
        multiplier: 1 / imgMultiplier
    });
    link.click();
}

/** Load images to the canvas over the overlay image
 * 
 * @param {*} url : Image Raw Data as URL
 */
window.updatePreview = function(url) {
    fabric.Image.fromURL(url, function(img) {
        // Calc resize ratio to fit any overlay images to width or height of canvas
        var resizeRatio = (canvas.width / img.width) > (canvas.height / img.height) ? (canvas.width / img.width) : (canvas.height / img.height);
        if (mobileCheck()) {
            canvas.overlayImage.opacity = 0.2;
            canvas.renderAll();
            setTimeout(function() {
                canvas.overlayImage.opacity = 1;
                canvas.renderAll();
            }, 5000);
        }
        var oImg = img.set({
            left: 0, // Specify the exact position you want the image to be
            top: 0, // Specify the exact position you want the image to be
            cornerColor: 'red',
            cornerSize: 20,
            transparentCorners: false,
            borderColor: 'red'
        }).scale(resizeRatio / 1);
        canvas.add(oImg);
        canvas.setActiveObject(oImg);
    });

    // Ensure the download button's click event is bound only once
    document.getElementById("download-btn").onclick = function() {
        console.log("Download button clicked");  // Debugging log
        fabric.Image.fromURL(document.getElementById("selected-banner").src, function(img) {
            imgRatio = img.width / img.height;
            var winWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            ocw = canvas.width;
            cw = (winWidth * ratioCanWin) > 350 ? (winWidth * ratioCanWin) : 350;
            canvas.setWidth(cw);
            canvas.setHeight(cw / imgRatio);
            imgMultiplier = canvas.width / img.width;
            var oImg = img.set({
                left: 0,
                top: 0
            }).scale(imgMultiplier);
            canvas.setOverlayImage(oImg, function() {
                canvas.renderAll();
                setTimeout(downloadCanvas, 100);
            });
        });
    };
    document.getElementById("download-btn").removeAttribute("disabled");
};

/**
 * 
 * @param {*} input : Image file info to put on overlay image
 */
window.onFileChange = function(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        filename = input.files[0].name.split('.').slice(0, -1).join('.');
        reader.onload = function(e) {
            image = new Image();
            image.onload = function() {
                var width = this.width;
                var height = this.height;
                if (width >= 400 && height >= 400)
                    updatePreview(e.target.result);
                else
                    alert("The photo should be at least 400px wide and 400px high.");
            };
            image.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

/** Calc the width and height of canvas for responsive design */

window.freshCanvas = function() {
    var selectedBannerSrc = document.getElementById("canva").src;
    if (selectedBannerSrc) {
        fabric.Image.fromURL(selectedBannerSrc, function(img) {
            imgRatio = img.width / img.height;
            var winWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            ocw = canvas.width;
            cw = (winWidth * ratioCanWin) > 350 ? (winWidth * ratioCanWin) : 350;
            canvas.setWidth(cw);
            canvas.setHeight(cw / imgRatio);
            imgMultiplier = canvas.width / img.width;
            var oImg = img.set({
                left: 0,
                top: 0
            }).scale(imgMultiplier);
            canvas.setOverlayImage(oImg, canvas.renderAll.bind(canvas));
        });
    }
}

window.selectBanner = function(bannerSrc) {
    var selectedBanner = document.getElementById("selected-banner");
    selectedBanner.src = bannerSrc;
    document.getElementById("selected-banner-container").classList.remove("hidden");
    freshCanvas();
}

$(document).ready(function() {
    freshCanvas();

    if (mobileCheck()) {
        $(".title").css("width", "80%");
        $("#download img").css("width", "80%");
    }

    /** For responsive */
    $(window).on('resize', function() {
        freshCanvas();
    });

    /** Change transparency of the overlay image when the pointer over the canvas */
    canvas.on('mouse:over', function(e) {
        if (canvas.overlayImage) {  // Check if overlayImage exists
            canvas.overlayImage.opacity = 0.5;
            canvas.renderAll();
        }
    });
    
    canvas.on('mouse:out', function(e) {
        if (canvas.overlayImage) {  // Check if overlayImage exists
            canvas.overlayImage.opacity = 1;
            canvas.renderAll();
        }
    });
    
});

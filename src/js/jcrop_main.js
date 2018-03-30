$(function(){
    // for sample 1
    $('#cropbox1').Jcrop({ // we linking Jcrop to our image with id=cropbox1
        aspectRatio: 0,
        onChange: updateCoords,
        onSelect: updateCoords
    });
});

function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
    $('#x2').val(c.x2);
    $('#y2').val(c.y2);
    var rx = 200 / c.w; // 200 - preview box size
    var ry = 200 / c.h;
    document.getElementById("latest_coordinates").innerHTML = "<br>Located Co-ordinates: "+c.x+":"+c.y+":"+c.x2+":"+c.y2;
    // localStorage.setItem("x1",c.x);
    // localStorage.setItem("y1",c.y);
    // localStorage.setItem("x2",c.x2);
    // localStorage.setItem("y2",c.y2);
    sx = (c.x)*(1920/800);
    sy = (c.y)*(1080/500);
    sx2 = (c.x2)*(1920/800);
    sy2 = (c.y2)*(1080/500);
    console.log("Scaled Coordinates: "+sx+":"+sy+":"+sx2+":"+sy2);
    localStorage.setItem("x1",sx);
    localStorage.setItem("y1",sy);
    localStorage.setItem("x2",sx2);
    localStorage.setItem("y2",sy2);
};

function checkCoords() {
    if (parseInt($('#w').val())) return true;
    alert('Please select a crop region then press submit.');
    return false;
};


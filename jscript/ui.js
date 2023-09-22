$(".closeLayerInfo").click(function() {
	$("#layerInfo, #helpPane").css("display", "none");
});

$( "#Help" ).click(function(e) {
	e.stopPropagation();
	if ( $( "#helpPane" ).css("display") == "block" ) {
		$( "#helpPane" ).css("display", "none");
		return true;
	}
	$( "#helpPane" ).css("display", "block");
});

$( ".progressbarContainer" ).click(function(e) {
	if ( maxMouseTick == 0) {
		return false;
	}
	var vOffset   = $(this).offset().top,
		vPosition = e.clientY - vOffset;
	mouseTick = Math.trunc((maxMouseTick * (vPosition / 300) / 4) - 1) * 4;
	dissolve(0)
});

$(".timeControlBtn").on("mousedown touchstart", function(event) {
	if (event.type === "touchstart") {
		event.preventDefault();
	}
	mouseDown = 1;
	delta = parseInt( $(this).attr("dir") , 10 ) * 4;
	tracePressure(delta);
});

$(".timeControlBtn").on("mouseup touchend mouseleave", function(event) {
	mouseDown = 0;
});
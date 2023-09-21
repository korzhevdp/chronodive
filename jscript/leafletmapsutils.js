$("#LMapsID").height($(window).height() + 'px');

var map,
	stockPile,
	rippleIcon,
	contours,
	mapLayers,
	markers,
	mouseDown        = 0,
	mouseTick        = 0,
	maxMouseTick     = 0,
	skin             = 0,
	clickPoint       = {},
	visibleOptions   = {
		fill         : true,
		fillColor    : '#ffff00',
		fillOpacity  : .2,
		stroke       : true,
		color        : '#ffff00',
		weight       : 2
	},
	invisibleOptions = {
		stroke       : false,
		fill         : false
	};

function processMapClick(event, layer, zIndex) {
	if ( isPointInsidePolygon(event, layer) ) {
		layerOptions = layer.options.semantics;
		baseLayers[layerOptions.filename].setOpacity(0).setZIndex(zIndex).addTo(mapLayers);
		stockPile.push( layerOptions );
		title = layerOptions.datestamp + ", " +
				layerOptions.BildNr +
				"; полёт: " + layerOptions.flight +
				", год: "   + layerOptions.year +
				", кадр: "  + layerOptions.frame;
		$("#dateStamp").append('<span ref="' + layerOptions.id + '" title="' + title + '" class="datestampPlate">' + layerOptions.datestamp + '</span>');
		$(".barcontainer").prepend('<div title="' + layerOptions.datestamp + '" class="meterpoints"></div>');
		zIndex += 1;
	}
}

function fillBaseLayers(data) {
	for ( a in data.features ) {
		object     = data.features[a];
		URLPattern = 'https://www.signumtemporis.ru/tilebase/' + object.properties.filename + '/{z}/{x}/{y}.png';
		baseLayers[object.properties.filename] = L.tileLayer(URLPattern, {
			interactive   : false,
			maxNativeZoom : 18,
			minZoom       : 4,
			id            : object.properties.id,
			tms           : true,
			opacity       : 0,
			maxZoom       : 18,
			attribution   : '&copy; KDP, &copy; NARA; JCC'
		});
	}
}

function isPointInsidePolygon(point, polygon) {
	var polyPoints = polygon.getLatLngs(),
		x          = point.latlng.lat,
		y          = point.latlng.lng,
		inside     = false;
	polyPoints = (polygon.feature.geometry.type == "MultiPolygon") ? polyPoints[0][0] : polyPoints;
	for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
		var xi = polyPoints[i].lat,
			yi = polyPoints[i].lng,
			xj = polyPoints[j].lat,
			yj = polyPoints[j].lng,
			intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		inside = (intersect) ? !inside : inside;
	}
	return inside;
}

function addHandler(object, event, handler) {
	var added = false;
	if ( object.addEventListener ) {
		object.addEventListener(event, handler, {passive: false});
		added = true;
	}
	if ( object.attachEvent ) {
		object.attachEvent('on' + event, handler);
		added = true;
	}
	if ( !added ) {
		console.log("Обработчики не поддерживаются");
	}
}

function wheel(event) {
	//console.log(mouseTick)
	var delta,
		event = event || window.event;
		//event.preventDefault();
		//event.stopPropagation();

	//if (!event.ctrlKey) {
	//	event.preventDefault();
	//	event.stopPropagation();
	//	return false;
	//}

	if ( event.wheelDelta ) {
		delta = event.wheelDelta / 120;
		if (window.opera) { delta = -delta };
	}

	if ( event.detail ) {
		delta = -event.detail / 3;
	}

	if ( event.preventDefault ) {
		event.preventDefault();
	}
	event.returnValue = false;
	dissolve(delta);
}

function setDatestampListeners() {
	$(".datestampPlate").mouseenter(function() {
		var id = $(this).attr("ref");
		//console.log('enter ' + id);
		contours.eachLayer(function(layer) {
			if (layer.options.semantics.id == id) {
				layer.setStyle(visibleOptions);//.setZIndex(120);
			}
		});
	});
	$(".datestampPlate").mouseleave(function() {
		var id = $(this).attr("ref");
		//console.log('leave ' + id);
		contours.eachLayer(function(layer) {
			if (layer.options.semantics.id == id) {
				layer.unbindTooltip();
				layer.setStyle(invisibleOptions);//.setZIndex(1);
			}
		});
	});
	$(".datestampPlate").click(function() {
		var ref = $(this).attr("ref");
		for ( a in stockPile ) {
			if ( stockPile[a].id == ref ) {
				$("#dateTaken" ).html(stockPile[a].datestamp);
				$("#archiveNum").html(stockPile[a].BildNr);
				$("#flightNum" ).html(stockPile[a].flight);
				$("#frameNum"  ).html(stockPile[a].frame);
			}
		}
		$("#layerInfo" ).css("display", "block");
	});
}

function dissolve(delta) {
	mouseTick = (mouseTick <= maxMouseTick + delta) ? mouseTick - (delta * 4) : maxMouseTick;

	if ( mouseTick < 0 ) {
		mouseTick = 0;
		//$("#dateStamp").css("margin-top", "0");
		//$("#techInfo").empty().html("E: Позиция:&nbsp;" + mouseTick + " (" + maxMouseTick + "),&nbsp;&nbsp;Активный слой:&nbsp;" + skin + ",&nbsp;&nbsp;Файл:&nbsp;" + stockPile[Math.floor(mouseTick / 200)].filename);
		return false;
	}
	if ( stockPile === undefined ) {
		return false;
	}
	if ( !stockPile.length ) {
		return false;
	}

	$(".grayscale img").css("filter", "grayscale(" + (( mouseTick < 100 ) ? mouseTick / 100 : 1 ) + ")");

	if ( mouseTick == 0 ) {
		$("#dateStamp").css("margin-top", "0");
	}

	if (mouseTick > maxMouseTick) {
		mouseTick = maxMouseTick;
		return false;
	}
	skin      = Math.floor(mouseTick / 200);
	opacity   = (Math.floor(mouseTick / 100) % 2) ? 1 : (mouseTick % 100) / 100 ;
	depth     = 100 * (1 - (mouseTick / maxMouseTick));
	$("#depthMeter").css("height", depth + "%");

	//$("#techInfo").empty().html("Позиция:&nbsp;" + mouseTick + " (" + maxMouseTick + "),&nbsp;&nbsp;Активный слой:&nbsp;" + skin + ",&nbsp;&nbsp;Файл:&nbsp;" + stockPile[skin].filename + " * " + opacity);

	$("#dateStamp").css("margin-top", (mouseTick / -4) + "px");

	//Управление прозрачностью слоя.
	if ( stockPile[skin] !== undefined ) {
		baseLayers[stockPile[skin].filename].setOpacity(opacity);
		if ( map.getZoom() < stockPile[skin].minZoom ) {
			targetZoom = stockPile[skin].minZoom;
		}
		if ( map.getZoom() > stockPile[skin].maxZoom ) {
			targetZoom = stockPile[skin].maxZoom;
		}
		map.setView(clickPoint, targetZoom );
	}
	//Управление прозрачностью иных слоёв
	for ( a in stockPile ) {
		if (a == skin || a == skin-1 || a == skin-2 ) {
			if ( stockPile[skin-2] !== undefined ) {
				baseLayers[stockPile[skin-2].filename].setOpacity(1 - opacity);
			}
			continue;
		}
		baseLayers[stockPile[a].filename].setOpacity(0);
	}
}

function tracePressure(delta) {
	//console.log(mouseTick, delta);
	if (mouseTick > maxMouseTick) {
		mouseTick = maxMouseTick;
		mouseDown = 0;
	}
	setTimeout(function(){
		if ( mouseDown ) {
			dissolve(delta);
			tracePressure(delta);
		}
	}, 100);
}

function mapInit() {
	map        = L.map('LMapsID', {
		scrollWheelZoom	: false,
		zoom			: 13,
		maxZoom			: 18,
		minZoom			: 4,
		center			: L.latLng([64.54903030671586,40.55191040039063]),
		crs				: L.CRS.EPSG3857,
		worldCopyJump	: true
	})
	.on('contextmenu', function(e) {
		console.log("[" + e.latlng.lat + "," + e.latlng.lng + "]");
	})
	.on('click', function(event) {
		var zIndex   = 2;
		clickPoint   = event.latlng;
		stockPile    = [];
		mouseTick    = 0;
		markers.clearLayers();
		mapLayers.clearLayers();
		//map.panTo(clickPoint, { animate: true, duration: 2.5 });
		$("#dateStamp").empty().append('<span ref="0" class="datestampPlate">Современность</span>').css("margin-top", "0");
		$("#depthMeter").css("height", "100%");
		$(".grayscale img").css("filter", "grayscale(0)");
		L.marker( event.latlng, { icon : rippleIcon } ).addTo(markers);
		setTimeout(function() { markers.clearLayers(); }, 7400);
		contours.eachLayer(function(layer) { processMapClick(event, layer, zIndex); });
		$(".meterpoints").css( "height", 100 / stockPile.length + "%" );
		setDatestampListeners();
		maxMouseTick  = (stockPile.length) * 200;
	});
	rippleIcon = L.icon({ iconUrl: '/chronodive/images/ripple77.gif', iconSize: [300, 300], iconAnchor: [150, 150] });
	starIcon   = L.icon({ iconUrl: '/chronodive/images/bullet_red.png', iconSize: [32, 32], iconAnchor: [16, 16] });
	contours   = L.featureGroup().addTo(map);
	mapLayers  = L.featureGroup().addTo(map);
	markers    = L.featureGroup().addTo(map);

	baseLayers = {
		sat : L.tileLayer('https://mt1.google.com/vt/lyrs=s&hl=ru&x={x}&y={y}&z={z}&s=Galileo', {
			maxNativeZoom	: 18,
			minZoom			:  4,
			opacity			: 1,
			maxZoom			: 18,
			className		: 'grayscale',
			attribution		: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		})
	};

	baseLayers['sat'].addTo(map);

	$.ajax({
		url      : 'https://www.signumtemporis.ru/chronodive/rasters.geojson',
		type     : 'GET',
		dataType : 'json',
		success  : function(data) {
			data.features.sort(function(x, y) {
				if (x.properties.zIndex > y.properties.zIndex) { return -1; }
				if (x.properties.zIndex < y.properties.zIndex) { return  1; }
				return 0;
			});
			L.geoJSON(data, {
				style         : invisibleOptions,
				onEachFeature : function (feature, layer) {
					layer.options.semantics = feature.properties;
					layer.addTo(contours);
				}
			});
			fillBaseLayers(data);
		},
		error: function(data,stat,err){}
	});
};

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
	//console.log($(this).offset(), e);
	if ( maxMouseTick == 0) {
		return false;
	}
	var vOffset   = $(this).offset().top,
		vPosition = e.clientY - vOffset;
	mouseTick = Math.trunc((maxMouseTick * (vPosition / 300) / 4) - 1) * 4;
	dissolve(0)
	//console.log(fractionOffset);
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
	//event.preventDefault();
	mouseDown = 0;
	//console.log("mouse up");
});

addHandler(window  , 'DOMMouseScroll', wheel);
addHandler(window  , 'mousewheel'    , wheel);
addHandler(document, 'mousewheel'    , wheel);

if ( localStorage.getItem('ack') == null || localStorage.getItem('ack') == 0 ) {
	$("#Help").click();
	localStorage.setItem('ack', 1);
}

$( document ).ready(mapInit);

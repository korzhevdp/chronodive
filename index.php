<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="/chronodive/css/leaflet.css">
		<link rel="stylesheet" href="/chronodive/css/map.css">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta property="vk:image" content="https://www.signumtemporis.ru/chronodive/images/Chronoleap.png">
		<meta property="og:title" content="ChronoDive Engine. Archangelsk">
		<meta name="Keywords" content="Архангельск, план Архангельска, аэрофотосъемка архангельска, Северодвинск, Молотовск 1943, Нарьян-Мар, Signum Temporis">
		<meta name="Description" content="ChronoDive - Историческая космическая фотосъёмка городов Северо-Запада России. Аэрофотосъёмка времён ВОВ. Анализ данных объективного контроля: USGS, Luftwaffe. Классификатор фотоснимков.">

		<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
		<link rel="manifest" href="/favicon/site.webmanifest">
		<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5">
		<meta name="msapplication-TileColor" content="#da532c">
		<meta name="theme-color" content="#ffffff">
		<meta name="yandex-verification" content="db8f2f930081ee04" />

		<link rel="canonical" href="https://www.signumtemporis.ru/chronodive">
		<title>ST ChronoDive | Архангельск</title>
	</head>

	<body>
		<div id="Help" class="helpControlBtn" title="А что делать-то?">
			?
		</div>
		<div id="goDeep"    dir="1"  class="timeControlBtn" title="Из глубин времён">
			<img src="/chronodive/images/arrow-090.png" width="16" height="16" border="0" alt="&#129093;">
		</div>
		<div id="goSurface" dir="-1" class="timeControlBtn" title="Вглубь времён">
			<img src="/chronodive/images/arrow-270.png" width="16" height="16" border="0" alt="&#129095;">
		</div>
		<div id="LMapsID"></div>
		<div class="progressbarContainer">
			<div class="barcontainer">
				<div class="bar" id="depthMeter"></div>
			</div>
		</div>

		<!--<div id="techInfo"></div>-->

		<div id="layerInfo">
			<div class="headerLayerInfo">
				<span class="closeLayerInfo">&times;</span>
			</div>
			<div id="bodyLayerInfo">
				<table>
					<tr>
						<th>Дата снимка</th>
						<td id="dateTaken">&nbsp;</td>
					</tr>
					<tr>
						<th>Номер снимка</th>
						<td id="archiveNum">&nbsp;</td>
					</tr>
					<tr>
						<th>Полёт</th>
						<td id="flightNum">&nbsp;</td>
					</tr>
					<tr>
						<th>Номер кадра</th>
						<td id="frameNum">&nbsp;</td>
					</tr>
				</table>
			</div>
		</div>

		<div id="helpPane">
			<div class="headerLayerInfo">
				<span class="closeLayerInfo">&times;</span>
			</div>
			<table>
			<tr>
				<td class="col1">Щёлкните точку на карте.</td>
				<td class="col2"><img src="/chronodive/images/clickmap.jpg" width="50" height="40" border="0" alt=""></td>
			</tr>
			<tr>
				<td class="col1">Вращая колесо мыши или при помощи стрелок в правом верхнем углу, прокручивайте известную нам историю места.</td>
				<td class="col2">
					<div class="demoControlBtn">
						<img src="/chronodive/images/arrow-090.png" width="16" height="16" border="0" alt="&#129093;">
					</div><br>
					<div class="demoControlBtn">
						<img src="/chronodive/images/arrow-270.png" width="16" height="16" border="0" alt="&#129095;">
					</div>
				</td>
			</tr>
			<tr>
				<td class="col1">Масштаб карты изменяется кнопками в левом верхнем углу.</td>
				<td class="col2"><img src="/chronodive/images/zoombtns.png" width="59" height="70" border="0" alt=""></td>
			</tr>
			</table>
		</div>

		<div id="dateInfo">
			<div id="dateStamp">
				<span ref="0" class="datestampPlate">Современность</span>
			</div>
		</div>

		<img src="/chronodive/images/ripple77.gif" style="display:none;width:300px;height:300px;border:0" class="ripplePointer hide" alt="">
		<script type="text/javascript" src="/chronodive/jscript/jquery.js"></script>
		<script type="text/javascript" src="/chronodive/jscript/leaflet.js"></script>
		<script type="text/javascript" src="/chronodive/jscript/leafletmapsutils.js"></script>
		<script type="text/javascript" src="/chronodive/jscript/ui.js"></script>
		<?php include("../includes/metrika.php");?>

	</body>
</html>

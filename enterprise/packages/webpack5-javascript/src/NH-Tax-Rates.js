// https://www.npmjs.com/package/leaflet/v/2.0.0-alpha

import { municipalities } from "./municipalities.js";

import { Map } from "../node_modules/leaflet/src/map/index.js";
import { Browser } from "../node_modules/leaflet/src/core/index.js";
import { GeoJSON } from "../node_modules/leaflet/src/layer/index.js";
import { TileLayer } from "../node_modules/leaflet/src/layer/tile/index.js";
import { LatLng } from "../node_modules/leaflet/src/geo/index.js";
import { DomUtil } from "../node_modules/leaflet/src/dom/index.js";
import { Control, Zoom } from "../node_modules/leaflet/src/control/index.js";

// import L from 'leaflet';
// import { Map, Circle } from 'leaflet';

import "leaflet/src/leaflet.css";

const totalPctls = [14.34, 20.06];
const muniPctls = [3.55, 5.4];
const countyPctls = [0.96, 1.94];
const stateEduPctls = [1.16, 1.43];
const localEduPctls = [7.43, 11.73];

function getColor(d, pctlsArray) {
    return d >= pctlsArray[1]
        ? "rgb(255,0,0)"
        : d >= pctlsArray[0]
        ? "rgb(255,255,0)"
        : "rgb(0,128,0)";
}

const totalRatesLayer = new GeoJSON(municipalities, {
    style: styleTotalRates,
    onEachFeature,
});

const muniRatesLayer = new GeoJSON(municipalities, {
    style: styleMuniRates,
    onEachFeature,
});

const countyRatesLayer = new GeoJSON(municipalities, {
    style: styleCountyRates,
    onEachFeature,
});

const stateEduRatesLayer = new GeoJSON(municipalities, {
    style: styleStateEduRates,
    onEachFeature,
});

const localEduRatesLayer = new GeoJSON(municipalities, {
    style: styleLocalEduRates,
    onEachFeature,
});

const map = new Map("map1", {
    zoomControl: false,
    minZoom: 6,
    maxZoom: 14,
    center: new LatLng(44.005, -71.4688),
    // renderer: new Browser.canvas() ? L.canvas() : L.svg(),
    preferCanvas: true,
    layers: [totalRatesLayer], // add default layer(s)
    // zoom: isMobile ? 7 : 8,
    // maxBoundsViscosity: .2,
}).fitBounds([
    [42.697, -72.5572],
    [45.3055, -70.6106],
]);

new TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const isMobile = Browser.mobile;
const userAction = isMobile ? "Tap" : "Click or hover";

// START CHOROPLETH

// control that shows info on hover
const info = new Control({
    position: "topleft",
});

function addInfoDiv() {
    info.onAdd = function () {
        this._div = new DomUtil.create("div", "info");
        // L.DomEvent.disableClickPropagation(this._div);
        // L.DomEvent.disableScrollPropagation(this._div);
        this.update();
        return this._div;
    };

    info.update = function (props) {
        const contents = props
            ? `<b>${props.NAME}</b><br>${
                  props.COUNTY
              } County, NH<br>Tax Rate: ${props.TOTAL.toFixed(
                  2
              )}<br>Municipal: ${props.MUNI.toFixed(
                  2
              )}<br>County: ${props.CNTY.toFixed(
                  2
              )}<br>State Edu.: ${props.STATE_EDU.toFixed(
                  2
              )}<br>Local Edu.: ${props.LOCAL_EDU.toFixed(2)}`
            : `${userAction} a location`;
        this._div.innerHTML = `${contents}`;
    };

    info.addTo(map);
}

addInfoDiv();

// const groupedOverlays = {
// 	'2024 Tax Rates': {
// 		Total: totalRatesLayer,
// 		Municipal: muniRatesLayer,
// 		County: countyRatesLayer,
// 		'State Edu': stateEduRatesLayer,
// 		'Local Edu': localEduRatesLayer,
// 	},
// };

function styleTotalRates(feature) {
    return {
        weight: 2,
        color: "#000",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties["TOTAL"], totalPctls),
    };
}

function styleMuniRates(feature) {
    return {
        weight: 2,
        color: "#000",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties["MUNI"], muniPctls),
    };
}

function styleCountyRates(feature) {
    return {
        weight: 2,
        color: "#000",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties["CNTY"], countyPctls),
    };
}

function styleStateEduRates(feature) {
    return {
        weight: 2,
        color: "#000",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties["STATE_EDU"], stateEduPctls),
    };
}

function styleLocalEduRates(feature) {
    return {
        weight: 2,
        color: "#000",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties["LOCAL_EDU"], localEduPctls),
    };
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature
    });
}

function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 5,
        color: "#000",
        dashArray: "",
        fillOpacity: 0.7,
    });

    layer.bringToFront(); // fixes inconsistent border color

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    const ep = e.sourceTarget._eventParents;
    ep[Object.keys(ep)[0]].resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds(), {
        duration: 0.75,
        maxZoom: 10,
        padding: [100, 100],
    });
}

// END CHOROPLETH

function createMap() {
    // const mapContainer = map.getContainer();
    //
    // if (!!mapContainer) {
    // 	if (isMobile) {
    // 		mapContainer.style.height = '500px';
    // 	} else {
    // 		mapContainer.style.height = '700px';
    // 	}
    // 	setTimeout(() => map.invalidateSize(), 100);
    // }

    map.attributionControl.addAttribution(
        "Tax rate data provided by the NH Department of Revenue Administration"
    );

    mapRightClick(map);
}

function fitBounds() {
    // bounding box of New Hampshire
    // [42.6969,-72.5572],[45.3054,-70.6106]
    const southWest = new LatLng(42.6969, -72.5572),
        northEast = new LatLng(45.3054, -70.6106),
        boundingBox = LatLngBounds(southWest, northEast);

    map.fitBounds(boundingBox);
    // map.setMaxBounds(boundingBox);
}

function addLegend() {
    const legend = new Control({
        position: "bottomright",
    });

    legend.onAdd = () => {
        const div = DomUtil.create("div", "info legend");
        // L.DomEvent.disableClickPropagation(div);
        // L.DomEvent.disableScrollPropagation(div);

        const colors = ["rgb(0,128,0)", "rgb(255,255,0)", "rgb(255,0,0)"];
        const levels = ["Low", "Medium", "High"]; // , 'Highest'],
        let labels = [];

        for (let i = 0; i < levels.length; i++) {
            labels.push(
                `<i style="border:solid var(--border) thin;background:${colors[i]}"></i> ${levels[i]}`
            );
        }

        const text = `<div class="bold center" style="margin-bottom:5px;">2024 NH<br>Tax Rates</div>${labels.join(
            "<br>"
        )}`;
        div.insertAdjacentHTML("beforeend", text);
        return div;
    };

    legend.addTo(map);
}

async function addTileLayers() {
    const styleUrl =
        "https://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}{r}.png";
    const attribution =
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>';

    new TileLayer(styleUrl, {
        attribution: attribution,
        variant: "light_nolabels",
        // detectRetina: true // this makes tiles blurry on mobile
    }).addTo(map);

    await yieldMain();

    //  add map labels as a separate layer
    map.createPane("labels");
    map.getPane("labels").style.zIndex = 626;
    map.getPane("labels").style.pointerEvents = "none";

    new TileLayer(styleUrl, {
        attribution: attribution,
        variant: "light_only_labels",
        pane: "labels",
        // detectRetina: true // this makes tiles blurry on mobile
    }).addTo(map);
}

function addZoomControl() {
    L.control
        .zoom({
            position: "topright",
        })
        .addTo(map);
}

async function myMain() {
    const tasks = [
        createAgGrid,
        createMap,
        // fitBounds,
        addLegend,
        addTileLayers,
        addZoomControl,
        addInfoDiv,
    ];

    console.time("task loop");

    while (tasks.length > 0) {
        const task = tasks.shift();
        console.time(task.name);

        try {
            task();
        } catch (error) {
            // postData(error);
        }

        console.timeEnd(task.name);
        await yieldMain();
    }

    console.timeEnd("task loop");
}

myMain()
    .then((r) => {
        return r;
    })
    .catch((err) => {
        // postData(err);
    });

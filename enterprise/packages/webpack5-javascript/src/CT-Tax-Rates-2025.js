// import L from "leaflet";
// import { Map } from "../node_modules/leaflet/src/map";
// import { Browser } from "../node_modules/leaflet/src/core";
// import { GeoJSON } from "../node_modules/leaflet/src/layer";
// import { TileLayer } from "../node_modules/leaflet/src/layer/tile";
// import { LatLng } from "../node_modules/leaflet/src/geo";
// import { DomUtil, DomEvent } from "../node_modules/leaflet/src/dom";
// import { Control } from "../node_modules/leaflet/src/control";

// import * as groupedLayers from "leaflet-groupedlayercontrol";

// @ts-ignore
import {
    Browser,
    Control,
    DomEvent,
    DomUtil,
    GeoJSON,
    LatLng,
    // LatLngBounds,
    Map,
    TileLayer,
    // VideoOverlay,
    // Draggable,
} from "../node_modules/leaflet/src/Leaflet.js";

import "leaflet/src/leaflet.css";
// import "leaflet-groupedlayercontrol/src/leaflet.groupedlayercontrol.css";

import municipalitiesCT from "../src/CT-Tax-Rates-2025.json";

let jpsModule = (function () {
    // debugger;
    const municipalities = municipalitiesCT;

    let postData = function (e) {
        let d = new FormData();
        d.append(
            "a",
            e.message +
                " - " +
                window.visualViewport.width +
                "px" +
                " - " +
                window.location.href
        );
        d.append("b", e.filename);
        d.append("c", e.colno);
        d.append("d", e.lineno);
        d.append("s", e.stack);
        fetch("/Scripts/php/Error-Logger.php", { method: "POST", body: d });
    };

    // window.addEventListener("error", (e) => {
    // postData(e);
    // });

    // window.onerror = function (msg, url, line, col, err) {
    //     let e = {};
    //     e.message = msg;
    //     e.filename = url;
    //     e.colno = col;
    //     e.lineno = line;
    //     e.stack = err + "";
    //     // postData(e);
    // };

    function yieldMain() {
        return new Promise((res) => {
            setTimeout(res, 0);
        });
    }

    const realRatesPctls = [26, 31];
    const vehicleRatesPctls = [26, 31];

    function getColor(d, pctlsArray) {
        return d >= pctlsArray[1]
            ? "rgb(255,0,0)"
            : d >= pctlsArray[0]
            ? "rgb(255,255,0)"
            : "rgb(0,128,0)";
    }

    const realRatesLayer = new GeoJSON(municipalities, {
        style: styleRealRates,
        onEachFeature,
    });

    const vehicleRatesLayer = new GeoJSON(municipalities, {
        style: styleVehicleRates,
        onEachFeature,
    });

    const map = new Map("map1", {
        zoomControl: false,
        minZoom: 7,
        maxZoom: 14,
        center: new LatLng(41.5523, -72.7075),
        preferCanvas: true,
        // renderer: L.Browser.canvas ? L.canvas() : L.svg(),
        // zoom: isMobile ? 7 : 8,
        layers: [realRatesLayer], // add the default layer(s)
    }).setView([41.5175, -72.7573], 8);

    const groupedOverlays = {
        "CT Tax Rates": {
            Real: realRatesLayer,
            Vehicle: vehicleRatesLayer,
        },
    };

    const options = {
        exclusiveGroups: ["CT Tax Rates"],
        groupCheckboxes: true,
        collapsed: false,
        // position: 'topright', // 'topright' is default
    };

    // const groupedLayerControl = new Control.groupedLayers(
    //     null,
    //     groupedOverlays,
    //     options
    // );
    // map.addControl(groupedLayerControl);

    // new DomEvent.disableClickPropagation(groupedLayerControl._overlaysList);
    // new DomEvent.disableScrollPropagation(groupedLayerControl._overlaysList);

    const browser = Browser;

    const userAction = browser.mobile ? "Tap" : "Click or hover";

    // const tableWidth = window.visualViewport.width < 600 ? '105%' : '100%';

    // START CHOROPLETH

    // control that shows info on hover
    const info = new Control({
        position: "topleft",
    });

    function addInfoDiv() {
        info.onAdd = function () {
            this._div = new DomUtil.create("div", "info");
            new DomEvent.disableClickPropagation(this._div);
            new DomEvent.disableScrollPropagation(this._div);
            this.update();
            return this._div;
        };

        info.update = function (props) {
            const contents = props
                ? `<b>${props.NAME}</b><br>${
                      props.COUNTY
                  } County, CT<br>Tax Rate: ${props.REAL.toFixed(
                      2
                  )}<br>Vehicle Rate: ${props.MOTOR.toFixed(2)}`
                : `${userAction} a location`;
            this._div.innerHTML = `${contents}`;
        };

        info.addTo(map);
    }

    function styleRealRates(feature) {
        return {
            weight: 2,
            color: "#000",
            dashArray: "3",
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties["REAL"], realRatesPctls),
        };
    }

    function styleVehicleRates(feature) {
        return {
            weight: 2,
            color: "#000",
            dashArray: "3",
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties["MOTOR"], vehicleRatesPctls),
        };
    }

    function onEachFeature(feature, layer) {
        layer.on({
            pointerover: highlightFeature,
            pointerout: resetHighlight,
            click: zoomToFeature,
        });
    }

    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 4,
            color: "#000",
            dashArray: "",
            fillOpacity: 0.9,
        });

        layer.bringToFront(); // fixes inconsistent border color

        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        const ep = e.sourceTarget._eventParents;
        ep[Object.keys(ep)[0]].resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds(), {
            duration: 0.15,
            maxZoom: 10,
            padding: [100, 100],
        });
    }

    // END CHOROPLETH

    function createAgGrid() {
        if (!window.agGrid || !agGrid.createGrid) {
            return;
        }
        // debugger;
        const agGridDiv = document.getElementById("agGrid");

        if (!agGridDiv) {
            return;
        }

        let tableData = [];

        municipalities.features.map((feature) => {
            tableData.push([
                feature.properties.NAME,
                feature.properties.COUNTY,
                feature.properties.REAL,
                feature.properties.MOTOR,
            ]);
        });

        const pagingLimit =
            window.location.href.indexOf("2025.aspx") > -1 ? 25 : 50;

        // MAY NEED TO USE useState !!

        let gridApi = {};

        const gridOptions = {
            rowData: tableData,
            columnDefs: [
                {
                    field: "Location",
                    valueGetter: (p) => p.data[0],
                    pinned: "left",
                },
                { field: "County", valueGetter: (p) => p.data[1] },
                {
                    field: "Real",
                    valueGetter: (p) => p.data[2],
                    valueFormatter: (params) => params.value.toFixed(2),
                },
                {
                    field: "Vehicle",
                    valueGetter: (p) => p.data[3],
                    valueFormatter: (params) => params.value.toFixed(2),
                },
            ],
            columnHoverHighlight: true,
            autoSizeStrategy: {
                type: "fitGridWidth",
                defaultMinWidth: 140,
            },

            pagination: true,
            paginationPageSize: pagingLimit, // default = 100
            paginationPageSizeSelector: [10, 25, 50, 250],
        };

        gridApi = agGrid.createGrid(agGridDiv, gridOptions);

        const filterTextBox = document.getElementById("filter-text-box");

        if (!!filterTextBox) {
            let setFilterText = function () {
                return gridApi.setGridOption(
                    "quickFilterText",
                    filterTextBox.value
                );
            };

            filterTextBox.addEventListener("input", setFilterText, false);
        }
    }

    function createMap() {
        map.attributionControl.addAttribution(
            "Tax rate data provided by the CT Office of Policy and Management"
        );

        // mapRightClick(map);
    }

    function fitBounds() {
        // map.fitBounds(geoJson.getBounds(), { duration: 10.0, animate: false, });

        map.fitBounds(
            [
                [40.9801, -73.7277],
                [42.0505, -71.7869],
            ],
            {
                duration: 5,
                maxZoom: 14,
            }
        );

        console.log(map.getCenter());
    }

    function addLegend() {
        const legend = new Control({
            position: "bottomright",
        });

        legend.onAdd = () => {
            const div = new DomUtil.create("div", "info legend");
            new DomEvent.disableClickPropagation(div);
            new DomEvent.disableScrollPropagation(div);

            const colors = ["rgb(0,128,0)", "rgb(255,255,0)", "rgb(255,0,0)"];
            const levels = ["Low", "Medium", "High"]; // , 'Highest'],
            let labels = [];

            for (let i = 0; i < levels.length; i++) {
                labels.push(
                    `<i style="border:solid var(--border) thin;background:${colors[i]}"></i> ${levels[i]}`
                );
            }

            const text = `<div class="bold center" style="margin-bottom:5px">2024-25 CT<br>Tax Rates</div>${labels.join(
                "<br>"
            )}`;
            div.insertAdjacentHTML("beforeend", text);
            return div;
        };

        legend.addTo(map);
    }

    function addZoomControl() {
        new Control.Zoom({
            position: "topright",
        }).addTo(map);
    }

    async function addTileLayers() {
        const styleUrl =
            "https://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}{r}.png";
        const attribution =
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>';

        new TileLayer(styleUrl, {
            minZoom: 7,
            maxZoom: 14,
            attribution: attribution,
            variant: "light_nolabels",
        }).addTo(map);

        await yieldMain();

        //  add map labels as a separate layer
        map.createPane("labels");
        map.getPane("labels").style.zIndex = 626;
        map.getPane("labels").style.pointerEvents = "none";

        new TileLayer(styleUrl, {
            minZoom: 7,
            maxZoom: 14,
            attribution: attribution,
            variant: "light_only_labels",
            pane: "labels",
        }).addTo(map);
    }

    async function myMain() {
        const tasks = [
            // createAgGrid
            createMap,
            addTileLayers,
            fitBounds,

            addLegend,
            addZoomControl,

            addInfoDiv,
        ];

        console.time("task loop");

        while (tasks.length > 0) {
            const task = tasks.shift();
            // console.time(task.name);

            try {
                task.call();
            } catch (error) {
                throw error;
                // postData(error);
            }

            // console.timeEnd(task.name);
            await yieldMain();
        }

        console.timeEnd("task loop");
    }

    myMain().then((r) => {
        return r;
    });
    //.catch((err) => postData(err));
})();

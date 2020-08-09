'use strict';

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Mapbox from '@react-native-mapbox-gl/maps';
import { ViroARScene, ViroPolyline, ViroConstants } from 'react-viro';
import Geolocation from 'react-native-geolocation-service';
import proj4 from 'proj4'
Mapbox.setAccessToken('pk.eyJ1Ijoic2hyZXlhbnNoLXN0YXJrIiwiYSI6ImNrY244Njl2YTA4c20zM3JxeXhpc2ozcTEifQ.kYnwLvfVyPsH7zVZLT29HA')
const MAPBOX_KEY = 'pk.eyJ1Ijoic2hyZXlhbnNoLXN0YXJrIiwiYSI6ImNrY244Njl2YTA4c20zM3JxeXhpc2ozcTEifQ.kYnwLvfVyPsH7zVZLT29HA'

export default class Main extends Component {

    constructor() {
        super();
        this.state = {
            text: "Initializing AR...",
            pointsToDrawPolilyne: [],
        };

        this._onInitialized = this._onInitialized.bind(this);

    }

    componentDidMount() {
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }, () => {
                    this.polyLineMap()
                })
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    createObject(val1, val2, val3) {
        let createInitialPositionUTM = []
        createInitialPositionUTM.x = val1
        createInitialPositionUTM.y = val2
        createInitialPositionUTM.z = val3
        return createInitialPositionUTM
    }
    createObjects(val1, val2, val3) {
        let createInitialPositionUTM = [val1, val2, val3]
        // createInitialPositionUTM.x = val1
        // createInitialPositionUTM.y = val2
        // createInitialPositionUTM.z = val3
        return createInitialPositionUTM
    }


    polyLineMap = () => {
        let posCurrentLatLon = [this.state.longitude, this.state.latitude];
        let posDestinationLatLon = ["82.995176", "25.325495"]
        let MAPBOX_URL = `https://api.mapbox.com/directions/v5/mapbox/driving/${posCurrentLatLon[0]},${posCurrentLatLon[1]};${posDestinationLatLon[0]},${posDestinationLatLon[1]}.json?access_token=${MAPBOX_KEY}&overview=simplified&geometries=geojson`
        this.calculatePointsToPolilyne(MAPBOX_URL);
    }

    async calculatePointsToPolilyne(url) {
        let auxDirections = [];
        let auxPointsUtm = [];
        let aux1 = [];
        let aux2 = [];
        let auxCurrentUtm = [];
        const abc = []
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                const directions = responseJson;
                auxDirections = directions['routes'][0]['geometry']["coordinates"];
                for (let i = 0; i < auxDirections.length; i++) {
                    aux1.push(proj4(
                        "EPSG:4326",
                        "+proj=utm +zone=19 +ellps=GRS80 +units=m +no_defs",
                        [auxDirections[i][0], auxDirections[i][1]]));
                    auxPointsUtm[i] = this.createObject(aux1[i][0], 0, aux1[i][1]);
                }

                aux2.push(proj4(
                    "EPSG:4326",
                    "+proj=utm +zone=19 +ellps=GRS80 +units=m +no_defs",
                    [this.state.longitude, this.state.latitude]));
                auxCurrentUtm.push(this.createObject(aux2[0][0], 0, aux2[0][1]));
                for (let m = 0; m < auxCurrentUtm.length; m++) {
                    for (let n = 0; n < auxPointsUtm.length; n++) {
                        abc.push(new this.createObjects(auxPointsUtm[n].x - auxCurrentUtm[m].x, auxPointsUtm[n].y - auxCurrentUtm[m].y, auxPointsUtm[n].z - auxCurrentUtm[m].z))
                    }
                }
                this.setState({
                    pointsToDrawPolilyne: abc
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    _onInitialized(state) {
        if (state == ViroConstants.TRACKING_NORMAL) {
            //Tracking OK
        } else if (state == ViroConstants.TRACKING_NONE) {
            // Handle loss of tracking
        }
    }

    render() {
        console.log(this.state.pointsToDrawPolilyne, 'ljnlj')
        return (
            <ViroARScene onTrackingUpdated={this._onInitialized} >
                {this.state.pointsToDrawPolilyne.length > 0 ?
                    <ViroPolyline position={[0, 0, -2]} points={this.state.pointsToDrawPolilyne} thickness={0.5} /> : null}
            </ViroARScene>
        );
    }


}

var styles = StyleSheet.create({
    helloWorldTextStyle: {
        fontFamily: 'Arial',
        fontSize: 22,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
});

module.exports = Main;

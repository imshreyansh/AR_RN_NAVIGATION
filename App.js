/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ViroARSceneNavigator } from 'react-viro';
import Main from './components/Main'



export default class App extends Component {
  render() {
    return (
      <ViroARSceneNavigator
        worldAlignment='GravityAndHeading'
        initialScene={{ scene: Main }} />
    )
  }
}



module.exports = App

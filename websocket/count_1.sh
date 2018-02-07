#!/bin/bash

# Copyright 2013 Joe Walnes and the websocketd team.
# All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# Simple example script that counts to 50 at ~2Hz, then stops.
for ((COUNT = 1; COUNT <= 50; COUNT++))
do
  echo '[hh:mm:dd] [INFO]: '$COUNT$COUNT$RANDOM$SECONDS
  sleep 0.5
done

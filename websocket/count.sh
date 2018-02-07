#!/bin/bash

# Copyright 2013 Joe Walnes and the websocketd team.
# All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# Simple example script that counts to 10 at ~2Hz, then stops.
for ((COUNT = 1; COUNT <= 100; COUNT++))
do
  echo '{"type":"message","data":"[hh:mm:dd][info]'$COUNT$COUNT$RANDOM$SECONDS'\n"}'
  sleep 0.5
done

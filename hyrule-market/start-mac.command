#!/bin/bash
# HYRULE MARKET をローカルで開きます（Mac）。ダブルクリックで起動、終了はこのウィンドウを閉じてください。
cd "$(dirname "$0")"
( sleep 1; open "http://localhost:8080/" ) &
python3 -m http.server 8080

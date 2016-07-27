#!/usr/bin/bash
sed -i -e 's/seneca: false/seneca: true/g' ./config/environment.js
ember serve --proxy http://localhost:3000
sed -i -e 's/seneca: true/seneca: false/g' ./config/environment.js

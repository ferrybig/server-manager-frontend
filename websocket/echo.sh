#!/bin/sh
while read line
do
	echo "< $line" >&2
	echo '> {"success":1,"type":"instant","request":'$line',"data":"'$(echo $line | sed "s/\"/'/g")'"}' >&2
	echo '{"success":1,"type":"instant","request":'$line',"data":"'$(echo $line | sed "s/\"/'/g")'"}'
done

#!/bin/sh
var=0;
while read line
do
	var=$((var+1))
	echo "< $line" >&2
	if [[ $line = *'"register_channel"'* ]]; then
		echo '> {"success":1,"type":"stream","request":'$line', "id":'$var'}' >&2
		echo '{"success":1,"type":"stream","request":'$line', "id":'$var'}'
		(
			./count_1.sh | while read count
			do
				echo '> {"success":1,"moreData":1,"type":"stream_data","id":'$var', "data":"'$count'\n"}' >&2
				echo '{"success":1,"moreData":1,"type":"stream_data","id":'$var', "data":"'$count'\n"}'
			done 
			echo '> {"success":1,"moreData":0,"type":"stream_end","id":'$var'}' >&2
			echo '{"success":1,"moreData":0,"type":"stream_end","id":'$var'}'
		) &
	else
		echo '> {"success":1,"type":"delayed","request":'$line', "id":'$var'}' >&2
		echo '> {"success":1,"type":"delayed_data","id":'$var', "data":"'$(echo $line | sed "s/\"/'/g")'"}' >&2
		echo '{"success":1,"type":"delayed","request":'$line', "id":'$var'}'
		echo '{"success":1,"type":"delayed_data","id":'$var', "data":"'$(echo $line | sed "s/\"/'/g")'"}'
	fi
done

#!/bin/bash 
#
# Moves all the necessary files over to the web-facing end of the server
# Add elements that need to be moved to the web-facing end as necessary

BASE=/var/www/neighbor

mkdir -p $BASE

# Add elements here:
for x in node_modules app.js client do
	mv $x $BASE/
done

exit 0

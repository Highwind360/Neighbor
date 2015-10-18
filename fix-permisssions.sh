#!/bin/bash
#
# A really hacky workaround to deal with the fact that several 
# users are using this repo on the same box, and every pull and
# push from git will fuck up the permissions.
#
# Observe the gloriously insecure workaround:

MASTER_USER=masq # proper owner of the repo

# Ensure run as root
if [ "$(id -u)" != "0" ]; then
	echo "Got r00t?"; 1>&2
	exit 1
fi 

chown -R $MASTER_USER:sudo $(pwd)

exit 0

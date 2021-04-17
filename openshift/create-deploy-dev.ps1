Set-Variable -Name "name" -Value "admin"
Set-Variable -Name "env" -Value "dev"

# Potentially saw interference between these deletes so run them together.
Set-Variable -Name "tag" -Value "demo"
oc delete all,NetworkPolicy -n a4b31c-$env -l template=fom-$name-deploy,tag=$tag
Set-Variable -Name "tag" -Value "main"
oc delete all,NetworkPolicy -n a4b31c-$env -l template=fom-$name-deploy,tag=$tag

Set-Variable -Name "tag" -Value "demo"
oc process -f fom-$name-deploy.yml -p ENV=$env -p TAG=$tag -p HOSTNAME="nr-fom-$name-$tag-$env" | oc create -n a4b31c-$env -f -

Set-Variable -Name "tag" -Value "main"
oc process -f fom-$name-deploy.yml -p ENV=$env -p TAG=$tag -p HOSTNAME="nr-fom-$name-$tag-$env" | oc create -n a4b31c-$env -f -

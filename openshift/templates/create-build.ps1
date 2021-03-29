# This script is designed to NOT delete the ImageStream, so recreation of the Image Stream will fail.
Set-Variable -Name "name" -Value "admin"
Set-Variable -Name "tag" -Value "demo"
oc delete all -n a4b31c-tools -l template=fom-$name-build,tag=$tag
oc process -f fom-$name-build.yml -p TAG=$tag | oc create -n a4b31c-tools -f -

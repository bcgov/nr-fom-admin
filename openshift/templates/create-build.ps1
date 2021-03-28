 # WARNING: This deletes all existing resources, including tagged images.
 oc delete all -l template=fom-admin-build
 oc process -f fom-admin-build.yml | oc create -f -
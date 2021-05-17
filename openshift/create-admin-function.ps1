
function DeleteAdminFrontEnd {
    param($Suffix, $Env)

    Write-Output "Deleting existing resources for suffix $Suffix and env $Env ..."
    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-admin-deploy,suffix="fom$Suffix"
}

function CreateAdminFrontEnd {
    param ($ApiVersion, $Suffix, $Env)

    DeleteAdminFrontEnd -Suffix $Suffix -Env $Env

    Write-Output "Create Admin front-end for suffix $Suffix and env $Env using version $ApiVersion ..."
    oc process -f fom-admin-deploy.yml -p ENV=$Env -p SUFFIX=$Suffix -p HOSTNAME="nr-fom-admin$Suffix" -p IMAGE_STREAM_VERSION=$ApiVersion | oc create -n a4b31c-$Env -f -
}

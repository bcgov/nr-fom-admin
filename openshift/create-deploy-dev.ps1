
function CreateAdminFrontEnd {
    param ($ApiVersion, $Suffix, $Env)

    Write-Output "Create Admin front-end for suffix $Suffix and env $Env using version $ApiVersion ..."

    Write-Output "Deleting existing resources..."
    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-admin-deploy,tag=$Suffix

    Write-Output "Creating admin front-end..."
    oc process -f fom-admin-deploy.yml -p ENV=$Env -p TAG=$Suffix -p HOSTNAME="nr-fom-admin-$Suffix-$Env" -p IMAGE_STREAM_VERSION=$ApiVersion | oc create -n a4b31c-$Env -f -
}

CreateAdminFrontEnd -Suffix "main" -Env "dev" -ApiVersion "main" 
CreateAdminFrontEnd -Suffix "working" -Env "dev" -ApiVersion "dev" 

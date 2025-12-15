#This script is used to update the tagversion of image to the kubernate deployment yaml file.
#!/bin/bash
sed "s/tagVersion/$1/g" admin.yaml > admin-deploy.yml
#!/bin/bash
current_dir=$(pwd)
mkdir newRepos
current_dir="$current_dir/newRepos"
echo "current_dir ==> " $current_dir
echo =====================================================================================
echo "************ Options for lacadmin import ******************"
echo "$lacadmin api import --file <filename[.json|.zip]>
			[ --namecollision
			[fail|rename_new|replace_existing|disable_and_rename_existing] ]
			[ --errorhandling standard ]
			[ --verbose]"
echo =====================================================================================

echo " "
echo =============================================
echo ==== Checking versions for lac, lacadmin ====
echo =============================================
echo

lacVersion=$(lac --version)
lacAdminVersion=$(lacadmin --version)
lacadmin --version &> /dev/null
lacadmin login -u admin -p Password1 http://localhost:8080
repos=( 
  "/Users/hubva01/ca/OneDrive - CA Technologies/LiveAPICreator/api-projects/Market Integration/MktAdv/MarketingAdvanced"
)

echo ""
echo "Getting latest for" ${#repos[@]} "repositories using pull --rebase"

for repo in "${repos[@]}"
do
echo ""
echo =============================================
echo "****** Getting latest for" ${repo} "******"
echo =============================================
echo
  cd "${repo}"
  git pull --rebase
  echo "****** Pull Rebase for " ${repo} " Complete ******"
  for i in */; 
  do 
  	zip -r "${i%/}.zip" "$i"; 
  	echo "****** Zip the Project " ${i} " Complete ******"
  	mv *.zip $current_dir
  	echo "****** Move the zip to current dir  ******"
  	echo "******** Importing Project:: "$current_dir/"${i%/}.zip" " ******************"

  	lacadmin api import --file  $current_dir/"${i%/}.zip" --namecollision replace_existing
  done
done
echo "************* Complete ************"
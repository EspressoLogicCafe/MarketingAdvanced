@echo off 
cls 
echo ===================================================================================== 
echo "************ Options for lacadmin import ******************" 
echo "$lacadmin api import --file <filename[.json|.zip]> [ --namecollision [fail|rename_new|replace_existing|disable_and_rename_existing] ] [ --errorhandling standard ] [ --verbose]" 
echo ===================================================================================== 
echo " " 
echo ============================================= 
echo ==== Checking versions for lac, lacadmin ==== 
echo ============================================= 
echo lacVersion=lacadmin --version 
set repo= C:\Users\LACTeamUser\Desktop\path\togit\MarketingAdvanced
echo ============================================= 
echo "****** Getting latest for" %repo% "******" 
echo ============================================= 
cd /d %repo% 
git pull --rebase 
echo "REBASE DONE" 
echo %cd% 
call lacadmin login -u admin -p Password1 http://localhost:8080 -a DevServerAlias 
call lacadmin api import --file MktMgmt.zip --namecollision replace_existing 
call lacadmin api import --file MktConfOffers.zip --namecollision replace_existing 
call lacadmin logout echo "IMPORT DONE"

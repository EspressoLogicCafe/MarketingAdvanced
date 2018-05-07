@echo off 
cls 
set repo=%1

echo "%repo%"
if "%repo%"=="" goto help

if "%repo%" == "NoGit" goto :imports


rem eg, C:\Users\LACTeamUser\Desktop\path\togit\MarketingAdvanced
echo ============================================= 
echo "****** Getting latest for" %repo% "******" 
echo ============================================= 


echo
cd /d %repo% 
git pull --rebase 
echo "REBASE DONE" 
echo %cd% 

:imports
echo " " 
echo ============================================= 
echo ==== Importing MktMgmt and MktConfOffers 
echo ============================================= 
rem echo on
rem lacadmin --version
rem echo off
call lacadmin login -u admin -p Password1 http://localhost:8080 -a DevServerAlias 
call lacadmin api import --file MktMgmt.zip --namecollision replace_existing 
call lacadmin api import --file MktConfOffers.zip --namecollision replace_existing 
call lacadmin logout
echo "IMPORT DONE"
goto done

:help
echo =========== Options for lacadmin import ================ 
echo.
echo "$lacadmin api import --file <filename[.json|^.zip]> [ --namecollision [fail|rename_new|replace_existing|disable_and_rename_existing] ] [ --errorhandling standard ] [ --verbose]"
echo.
echo "LAC_devOps_Demo -repo { <git repo> ! NoGit }"
echo ============================================================ 
goto exit


:done
echo "done..."

:exit
exit /b
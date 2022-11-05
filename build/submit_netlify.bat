@echo off
set /p version="Version: "
call netlify deploy --prod --message %version% < build/netlify_deploy.in
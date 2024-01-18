
# for cg arrest data
pm2 start script/cg_arrest_trans.js --name "CG_Arrest_Trans$1" --log-date-format "YYYY-MM-DD HH:mm:ss.SSS" 


# For MH arrest data
pm2 start script/mh_arrest_trans.js --name "MH_Arrest_Trans$1" --log-date-format "YYYY-MM-DD HH:mm:ss.SSS" 


# --cron "*/35 * * * *"
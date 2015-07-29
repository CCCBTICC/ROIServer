###########################################################################################################################				
############################## RROI_Run_1 :  Run Optimization and Forecast  ###############################################
###########################################################################################################################				

#sudo R CMD BATCH --no-save --no-restore  '--args 1401313164_80.cfg' /var/www/deniX/webroot/ROI/algorithms/RROI_Run_1.R



###########################################################################################################################				
####################################  Optimization and Forecast  ########################################################## 
###########################################################################################################################				
setwd(rCodeFolder)

AlgStartingTime <-Sys.time()

cat("############# Optimization Starts #################\n")
source("RROI_Run_1_Optimization.R")
temp <- 
Run_1_Optimization(
Beg_Date      = Beg_Date,
End_Date      = End_Date, 
Inputfile     = Inputfile,
Estfile       = Estfile ,
Date          = Date
)
SR<- temp[["SR"]]
OptTotalRevenue <- temp[["OptTotalRevenue"]]
rm("temp")
cat("############# Optimization Ends #################\n")


cat("############# Forecast Starts #################\n")
source("RROI_Run_1_Forecast.R")
PR <- 
Run_1_Forecast(
Beg_Date     = Beg_Date,
End_Date     = End_Date, 
Inputfile    = Inputfile,
Fstfile      = Fstfile,
Date         = Date
)
cat("############# Forecast Ends #################\n")



#run1RevRange <- 0.03
#run1RevRange <- PR[ paste0(PRChannel, 'PR' )]/PR[length(PR)]* as.numeric(RevRange)
RevRange <- abs(RevRange)
       if(nMon==1 & LTAMTA=='_LTA') {      
run1RevRange <-  RevRange[1]
} else if(nMon==1 & LTAMTA=='_MTA') {  
run1RevRange <-  RevRange[2]
} else if(nMon==2 & LTAMTA=='_LTA') { 
run1RevRange <-  RevRange[3]
} else if(nMon==2 & LTAMTA=='_MTA') { 
run1RevRange <-  RevRange[4]
} else if(nMon==3 & LTAMTA=='_LTA') { 
run1RevRange <-  RevRange[5]
} else if(nMon==3 & LTAMTA=='_MTA') { 
run1RevRange <-  RevRange[6]
} else { 
run1RevRange <-  0.023
} 

run1ProjROI  <- PR[length(PR)]/SR[length(SR)] - 1

run1ROIRangeLB <- (run1ProjROI + 1)* (1 - run1RevRange) - 1
run1ROIRangeUB <- (run1ProjROI + 1)* (1 + run1RevRange) - 1

run1RevRange <- paste0("+/- ", 100*run1RevRange, "%")
run1ProjROI  <- paste0(round(100*run1ProjROI, 0), "%")
run1ROIRange <- paste0(round(100*run1ROIRangeLB, 0), "%/", round(100*run1ROIRangeUB, 0), "%")


print(paste0("Total PR: $", format(PR[length(PR)],  big.mark=",", big.interval=3)))
print(paste0("Total SR: $", format(SR[length(SR)],  big.mark=",", big.interval=3)))
print(paste0("Projected ROI: ", run1ProjROI))



#AlgStartingTime <-Sys.time()
AlgEndingTime <-Sys.time()
AlgDuration <-  difftime(AlgEndingTime, AlgStartingTime,  units = "auto")
 
AlgStartingTime=format(AlgStartingTime)
AlgEndingTime=format(AlgEndingTime)
AlgDuration=format(AlgDuration)

run2ProjROI <- run1ProjROI



###########################################################################################################################				
######################################## Create JSON Output File ##########################################################				
###########################################################################################################################	

commafmt <- function(x)  format(x,  big.mark=",", big.interval=3)
  
  #start outputting json file  
  sink(outJsonFileFullPath, append=FALSE, split=FALSE)
 

  cat(paste0("{","\n"))

  cat(paste0('"UserName":',      '"', inJsonData$UserName,      '",\n'))
  cat(paste0('"Brand":',         '"', inJsonData$Brand,         '",\n'))        
  cat(paste0('"Spend":',         '"', inJsonData$Spend,         '",\n'))
  cat(paste0('"StartingTime":',  '"', inJsonData$StartingTime,  '",\n'))
  cat(paste0('"PlanMonths":',    '"', inJsonData$PlanMonths,    '",\n'))
  cat(paste0('"EndingTime":',    '"', inJsonData$EndingTime,    '",\n'))
  cat(paste0('"lmTouch":',       '"', inJsonData$lmTouch,       '",\n'))
  
  cat(paste0('"Algorithm":',        '"', inJsonData$Algorithm,  '",\n'))
  cat(paste0('"AlgStartingTime":',  '"', AlgStartingTime,       '",\n'))
  cat(paste0('"AlgEndingTime":',    '"', AlgEndingTime,         '",\n'))
  cat(paste0('"AlgDuration":',      '"', AlgDuration,           '",\n'))
  #cat(paste('"Algorithm"',":",'"',inJsonData$Algorithm, '"',",\n",sep=""))
  #cat(paste('"AlgStartingTime"',":",'"',0.0, '"',",\n",sep=""))
  #cat(paste('"AlgEndingTime"',":",'"',0.0, '"',",\n",sep=""))
  #cat(paste('"AlgDuration"',":",'"',0.0, '"',",\n",sep=""))
  

  cat(paste0('"', paste0(ChannelOut, 'LB' ),  '": "', inJsonData[ paste0(ChannelOut, 'LB' )], '",\n'))
  cat(paste0('"', 'SpendLB' ,                 '": "', inJsonData[ 'SpendLB'],                 '",\n'))
  cat(paste0('"', paste0(ChannelOut, 'Min'),  '": "', inJsonData[ paste0(ChannelOut, 'Min')], '",\n'))
  cat(paste0('"', paste0(ChannelOut, 'Max'),  '": "', inJsonData[ paste0(ChannelOut, 'Max')], '",\n'))
  cat(paste0('"', paste0(ChannelOut, 'UB' ),  '": "', inJsonData[ paste0(ChannelOut, 'UB' )], '",\n'))
  cat(paste0('"', 'SpendUB' ,                 '": "', inJsonData[ 'SpendUB'],                 '",\n'))
  
  cat(paste0('"', paste0(ChannelOut, 'SF' ),  '": "', inJsonData[ paste0(ChannelOut, 'SF' )], '",\n'))
 
  cat(paste0('"dirSpendM1":',      '"', inJsonData$dirSpendM1,      '",\n'))
  cat(paste0('"dirSpendM2":',      '"', inJsonData$dirSpendM2,      '",\n'))
  cat(paste0('"dirSpendM3":',      '"', inJsonData$dirSpendM3,      '",\n'))

  
  cat(paste0('"tvBeginDate":"',   inJsonData$tvBeginDate,     '",\n'))
  cat(paste0('"tvEndDate":"',     inJsonData$tvEndDate,       '",\n'))
  cat(paste0('"tvImpressions":"', inJsonData$tvImpressions,   '",\n'))
  cat(paste0('"tvSpend":"',       inJsonData$tvSpend,         '",\n'))


  cat(paste0('"', paste0(SRChannel,  'SR' ),  '": "', round(SR, roDgt), '",\n'))
  cat(paste0('"OptTotalRevenue": ', '"', OptTotalRevenue, '",\n'))## added for optimizedTotalRevenue    
  cat(paste0('"', paste0(PRChannel,  'PR' ),  '": "', round(PR, roDgt), '",\n'))

  cat(paste0('"run1RevRange":',    '"', run1RevRange,  '",\n'))
  cat(paste0('"run1ProjROI":',     '"', run1ProjROI,   '",\n'))
  cat(paste0('"run1ROIRange":',    '"', run1ROIRange,  '",\n'))
  
  
  cat(paste0('"', paste0(ChannelOut,    'SlideLeft'         ),  '": "', inJsonData[ paste0(ChannelOut, 'LB' )], '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'Slide'             ),  '": "', round(SR[2:(length(SR)-1)], roDgt), '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideRight'        ),  '": "', inJsonData[ paste0(ChannelOut, 'UB' )], '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideDivMin'       ),  '": "', inJsonData[ paste0(ChannelOut, 'LB' )], '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideDivMax'       ),  '": "', inJsonData[ paste0(ChannelOut, 'UB' )], '",\n'))
  cat(paste0('"', paste0(ASChannel,     'AS'                ),  '": "', round(SR, roDgt), '",\n'))
  cat(paste0('"', paste0(ARChannel,     'AR'                ),  '": "', round(PR, roDgt), '",\n'))

  
  cat(paste0('"run2ProjROI":',    '"', run2ProjROI,  '"\n'))  # no comma before \n
  
  cat(paste0("}","\n"))

  
  #end outputting json file
  sink()


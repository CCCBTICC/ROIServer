###########################################################################################################################				
############################## RROI_Run_0 :  Run Optimization and Forecast  ###############################################
###########################################################################################################################				

#sudo R CMD BATCH --no-save --no-restore  '--args 1401313164_80.cfg' /var/www/deniX/webroot/ROI/algorithms/RROI_Run_0.R


###########################################################################################################################				
################################ Initialize:  Read Input Data and Generate Min Max  #######################################				
###########################################################################################################################	
setwd(rCodeFolder)

AlgStartingTime <-Sys.time()



data = read.csv(file = Inputfile, as.is = T)	
data[, Date] = as.Date(data[, Date], "%m/%d/%Y")
dim(data)	


#### Get data from Last Year during the same time period, only used for seting up daily spend lower/upper bound in Optimization
choose_LastYear = which(data[,Date] >= as.Date(Beg_Date_LastYear)  & data[,Date] <= as.Date(End_Date_LastYear))
data_LastYear = data[choose_LastYear, ]
Spend_LastYear = do.call(c,data_LastYear[, ChannelSpend])
length(Spend_LastYear)  #length(Spend_LastYear)=ndays_LastYear * 8 


#### Get current time period data, it would be missing (=NA) if Start_Date > input date range. 
#### It will not be used anywhere in the program, except for results comparision
choose_CurrentYear = which(data[,Date] >= as.Date(Beg_Date)       & data[,Date] <= as.Date(End_Date))
data_CurrentYear = data[choose_CurrentYear, ]
Spend_CurrentYear = do.call(c,data_CurrentYear[, ChannelSpend])
length(Spend_CurrentYear)  #length(Spend_CurrentYear)=ndays * 8 



Channel = rep(ChannelSpend,  times = rep(ndays_LastYear, length(ChannelSpend)))

#### For channel daily min/max bound; Use last year (10% Quantile)/2.0 and max*2.0 to be current year min/max
QuantilSmallTMP = unlist(tapply(Spend_LastYear, Channel, FUN = function(x)sort(x)[length(x)*0.1]))
QuantilSmall = data.frame(Channel = names(QuantilSmallTMP), Min = QuantilSmallTMP)


QuantilLargeTMP = unlist(tapply(Spend_LastYear, Channel, FUN = function(x)sort(x)[length(x)*1.0]))
QuantilLarge = data.frame(Channel = names(QuantilLargeTMP), Max = QuantilLargeTMP)

if(QuantilSmall["FB", ]$Min <=100)  QuantilSmall["FB", ]$Min = 1990  #2012 whole year FB 10% percentile
if(QuantilLarge["FB", ]$Max <=1000) QuantilLarge["FB", ]$Max = 36794 #2012 whole year FB max


LB = QuantilSmall$Min /2 * ndays
LB = LB[ChannelSpend]
names(LB) <- paste0(ChannelOut, "LB")

UB = QuantilLarge$Max*2 * ndays
UB = UB[ChannelSpend]
UB["SEMBrand"] = UB["SEMBrand"]*2 # SEMBrand loosen constraint
names(UB) <- paste0(ChannelOut, "UB")

print(paste0("sum of LB: $",  format(sum(LB),  big.mark=",", big.interval=3)))
print(paste0("sum of UB: $",  format(sum(UB),  big.mark=",", big.interval=3)))


#Min <- LB
#names(Min) <- paste0(ChannelOut, "Min")
#Max <- UB
#names(Max) <- paste0(ChannelOut, "Max")

#sem<- c(sum(LB[1:4]), sum(UB[1:4]), sum(Min[1:4]), sum(Max[1:4]))
#names(sem) <- paste0("sem", c("LB", "UB", "Min", "Max"))

#DM
dirSpendM1 <-NULL
dirSpendM2 <-NULL
dirSpendM3 <-NULL
dirSpend <- aggregate(data[choose_LastYear,"DM"], by=list(MONTH_LastYear), FUN=function(x) mean(x, na.rm=T))
if(nMon==1) {dirSpendM1 <- dirSpend[,2][1]}
if(nMon==2) {dirSpendM1 <- dirSpend[,2][1];dirSpendM2 <- dirSpend[,2][2]}
if(nMon==3) {dirSpendM1 <- dirSpend[,2][1];dirSpendM2 <- dirSpend[,2][2];dirSpendM3 <- dirSpend[,2][3]}

#TV
tvImpressions <- sum(data[choose_LastYear,]$TVImpression)
tvSpend       <- sum(data[choose_LastYear,]$TV)

#AlgStartingTime <-Sys.time()
AlgEndingTime <-Sys.time()
AlgDuration <-  difftime(AlgEndingTime, AlgStartingTime,  units = "auto")
 
AlgStartingTime=format(AlgStartingTime)
AlgEndingTime=format(AlgEndingTime)
AlgDuration=format(AlgDuration)

#SpendRange <-as.list(c(LB, UB, Min, Max)) 
                
print(cbind(LB, Actuala_LastYear=colSums(data_LastYear[, ChannelSpend]),  Actual_ThisYear=colSums(data_CurrentYear[, ChannelSpend] ), UB))
#write.csv(cbind(LB, Actuala_LastYear=colSums(data_LastYear[, ChannelSpend]),  Actual_ThisYear=colSums(data_CurrentYear[, ChannelSpend] ), UB), output, row.names=F)
#browseURL(file.path(getwd(), output))
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
  

  cat(paste0('"', paste0(ChannelOut, 'LB' ),  '": "', round(as.numeric(LB[ paste0(ChannelOut, 'LB' )]), roDgt), '",\n'))
  cat(paste0('"', 'SpendLB' ,                 '": "', round(sum(LB)+sum(dirSpend[,2]), roDgt), '",\n'))
  cat(paste0('"', paste0(ChannelOut, 'Min'),  '": "",\n'))
  cat(paste0('"', paste0(ChannelOut, 'Max'),  '": "",\n'))
  cat(paste0('"', paste0(ChannelOut, 'UB' ),  '": "', round(as.numeric(UB[ paste0(ChannelOut, 'UB' )]), roDgt), '",\n'))
  cat(paste0('"', 'SpendUB' ,                 '": "', round(sum(UB)+sum(dirSpend[,2]), roDgt), '",\n'))

  cat(paste0('"', paste0(ChannelOut, 'SF' ),  '": "', SF_cha, '",\n'))

  cat(paste0('"dirSpendM1":',      '"', round(as.numeric(dirSpendM1), roDgt),      '",\n'))
  cat(paste0('"dirSpendM2":',      '"', round(as.numeric(dirSpendM2), roDgt),      '",\n'))
  cat(paste0('"dirSpendM3":',      '"', round(as.numeric(dirSpendM3), roDgt),      '",\n'))

  
  cat(paste0('"tvBeginDate":"',   inJsonData$tvBeginDate,                       '",\n'))
  cat(paste0('"tvEndDate":"',     inJsonData$tvEndDate,                         '",\n'))
  cat(paste0('"tvImpressions":"', round(as.numeric(0), roDgt),      '",\n'))
  cat(paste0('"tvSpend":"',       round(as.numeric(0), roDgt),      '",\n'))


  cat(paste0('"', paste0(SRChannel,  'SR' ),  '": "",\n'))
  cat(paste0('"', paste0(PRChannel,  'PR' ),  '": "",\n'))
  
  cat(paste0('"run1RevRange": "",\n'))
  cat(paste0('"run1ProjROI":  "",\n'))
  cat(paste0('"run1ROIRange": "",\n'))
  
  cat(paste0('"', paste0(ChannelOut,    'SlideLeft'         ),  '": "",\n'))
  cat(paste0('"', paste0(ChannelOut,    'Slide'             ),  '": "",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideRight'        ),  '": "",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideDivMin'       ),  '": "",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideDivMax'       ),  '": "",\n'))
  cat(paste0('"', paste0(ASChannel,     'AS'                ),  '": "",\n'))
  cat(paste0('"', paste0(ARChannel,     'AR'                ),  '": "",\n'))
  
  cat(paste0('"run2ProjROI": ""\n'))  # no comma before \n
  
  cat(paste0("}","\n"))

  
  #end outputting json file
  sink()

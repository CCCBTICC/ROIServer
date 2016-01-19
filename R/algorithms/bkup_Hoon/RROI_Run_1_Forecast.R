###################################################################################################################
###################### Run_1_Forecast: Function of Forecasting Channel Revenue  ###################################
###################################################################################################################                                                                                     #


Run_1_Forecast <- function(
Beg_Date      = Beg_Date,
End_Date      = End_Date, 
Inputfile     = Inputfile,
Fstfile       = Fstfile,  # ModelV2
Date          = Date
)

{
options(warn = -1)

Fstfile#not in use
#Inputfile     = "RROI_input_data.csv"
#Fstfile       = "RROI_elasticity_table.csv"



########################## I/O Paths #####################################################################
# Input Historical Spending/Revenue
  InputSpendingPath = Inputfile

## Input Parameter              # ModelV2
#  InputParaPath     = Fstfile  # ModelV2


########################## User Input ####################################################################

#AttributionModel     = "LTA"        # "LTA" or "MTA"
#ChannelName          = "SEM"        # Channel name
#Start_YYYY_MM        = "2014-01-01" # starting YYYY-MM: This method require Start_YYYY_MM be at most one month 
                                        # after the historical data (the length of prediction period can be 1-3
                                        # months)
#planMonths           = 2            # number of months being planned (1-3)
#End_YYYY_MM          = "2013-01-31" # ending YYYY-MM - this is useless; Start_YYYY_MM and planMonths are enough
#ChannelScalingFactor = 1.0          # Channel scaling factor, a real number
#ChannelSpend         = 5e6          # ChannelSpend is the total channel spend over the planned period; it is 
                                        # one number

## Get parameter
Date                 = "Date"
AttributionModel     = ifelse(toupper(inJsonData$lmTouch) == "LAST TOUCH", "LTA", "MTA")        # "LTA" or "MTA"
ChannelName          = c("SEM", "Display",  "FB", "Affiliates", "Partners")         # Channel name
nChannels            = length(ChannelName)
ChannelRevenue       = paste0(ChannelName, "_", AttributionModel)
Start_YYYY_MM        = as.Date(Beg_Date) # starting YYYY-MM: This method require Start_YYYY_MM be at most one month 
                                        # after the historical data (the length of prediction period can be 1-3
                                        # months)
planMonths           = as.numeric(inJsonData$PlanMonths)           # number of months being planned (1-3)
ChannelScalingFactor = as.numeric(inJsonData[ paste0(c("semC", "dis",  "soc",  "aff", "par"), 'SF' )])         # Channel scaling factor, a real number

if (inJsonData$Algorithm==2) {
ChannelSpendInput       = SR[ paste0(c("sem", "dis",  "soc",  "aff", "par"), 'SR' )]  
ChannelScalingFactorSEM = SR[ paste0(c("semC", "semP", "semO", "semB"), 'SR' )]/SR["semSR"]* as.numeric(inJsonData[ paste0(c("semC", "semP", "semO", "semB"), 'SF' )])      
}     
if (inJsonData$Algorithm==3) {
ChannelSpendInput       = AS[ paste0(c("sem", "dis",  "soc",  "aff", "par"), 'SR' )]
ChannelScalingFactorSEM = AS[ paste0(c("semC", "semP", "semO", "semB"), 'SR' )]/AS["semSR"]* as.numeric(inJsonData[ paste0(c("semC", "semP", "semO", "semB"), 'SF' )])        
}       #AS has names of "SR"
ChannelScalingFactor[1]= ChannelScalingFactorSEM  #SEM scaling factor is weighted average of scaling factors of SEM subchannels



########################## Read Historical Data For Forecast #############################################

## Read spending input
data      = read.csv(file =  InputSpendingPath, as.is = T)
data$Date = as.Date(data$Date, "%m/%d/%Y")


#########################################################################
##### ModevlV2
#########################################################################
data[,-which(names(data)=="Date")] <- apply(data[,-which(names(data)=="Date")], 2, function(x) as.numeric(x))
IncludeDataForThePeriod <- ifelse( is.null(inJsonData$IncludeDataForThePeriod), "NO",
                                   ifelse(inJsonData$IncludeDataForThePeriod=="YES", "YES", "NO")  ) 
MaxDate_InputData = max(na.omit(as.Date(data$Date, "%m/%d/%Y"))) #Last Date data available 
PlanFW_LookB <- ifelse(MaxDate_InputData < as.Date(Beg_Date), "PlanForward", "LookBack") 
if(PlanFW_LookB=="PlanForward"){SkipMonths <- length(seq(from=as.Date(MaxDate_InputData), to=as.Date(Beg_Date), by='month')) - 1
                               }else{SkipMonths <- 0}                                

if(IncludeDataForThePeriod=="YES"){data = data[data$Date <= as.Date(End_Date),]
                                  }else{
                                  data = data[data$Date < as.Date(Beg_Date),]}


########################################
source("SubFunctions/d_monthly_aggregation.R")
data_monthly <- d_monthly_aggregation(data)   

data_monthly$Date<- as.Date(paste0(data_monthly$Month,"-01"))
names(data)[which(names(data)=="Affiliate")] <-"Affiliates"
names(data_monthly)[which(names(data_monthly)=="Affiliate")] <-"Affiliates"

data_monthly$Date<- as.Date(paste0(data_monthly$Month,"-01"))
data_monthly[data_monthly==0]<-1
data_monthly <- cbind(data_monthly, data.frame(
               SEM_LTA_l1=c(rep(NA,1),data_monthly$SEM_LTA[-nrow(data_monthly)])
              ,SEM_LTA_l12=c(rep(NA,12),data_monthly$SEM_LTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,SEM_LTA_l13=c(rep(NA,13),data_monthly$SEM_LTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Display_LTA_l1=c(rep(NA,1),data_monthly$Display_LTA[-nrow(data_monthly)])
              ,Display_LTA_l12=c(rep(NA,12),data_monthly$Display_LTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Display_LTA_l13=c(rep(NA,13),data_monthly$Display_LTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,FB_LTA_l1=c(rep(NA,1),data_monthly$FB_LTA[-nrow(data_monthly)])
              ,FB_LTA_l12=c(rep(NA,12),data_monthly$FB_LTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,FB_LTA_l13=c(rep(NA,13),data_monthly$FB_LTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Affiliates_LTA_l1=c(rep(NA,1),data_monthly$Affiliates_LTA[-nrow(data_monthly)])
              ,Affiliates_LTA_l12=c(rep(NA,12),data_monthly$Affiliates_LTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Affiliates_LTA_l13=c(rep(NA,13),data_monthly$Affiliates_LTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Partners_LTA_l1=c(rep(NA,1),data_monthly$Partners_LTA[-nrow(data_monthly)])
              ,Partners_LTA_l12=c(rep(NA,12),data_monthly$Partners_LTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Partners_LTA_l13=c(rep(NA,13),data_monthly$Partners_LTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,SEM_MTA_l1=c(rep(NA,1),data_monthly$SEM_MTA[-nrow(data_monthly)])
              ,SEM_MTA_l12=c(rep(NA,12),data_monthly$SEM_MTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,SEM_MTA_l13=c(rep(NA,13),data_monthly$SEM_MTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Display_MTA_l1=c(rep(NA,1),data_monthly$Display_MTA[-nrow(data_monthly)])
              ,Display_MTA_l12=c(rep(NA,12),data_monthly$Display_MTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Display_MTA_l13=c(rep(NA,13),data_monthly$Display_MTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,FB_MTA_l1=c(rep(NA,1),data_monthly$FB_MTA[-nrow(data_monthly)])
              ,FB_MTA_l12=c(rep(NA,12),data_monthly$FB_MTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,FB_MTA_l13=c(rep(NA,13),data_monthly$FB_MTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Affiliates_MTA_l1=c(rep(NA,1),data_monthly$Affiliates_MTA[-nrow(data_monthly)])
              ,Affiliates_MTA_l12=c(rep(NA,12),data_monthly$Affiliates_MTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Affiliates_MTA_l13=c(rep(NA,13),data_monthly$Affiliates_MTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Partners_MTA_l1=c(rep(NA,1),data_monthly$Partners_MTA[-nrow(data_monthly)])
              ,Partners_MTA_l12=c(rep(NA,12),data_monthly$Partners_MTA[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Partners_MTA_l13=c(rep(NA,13),data_monthly$Partners_MTA[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,SEM_l1=c(rep(NA,1),data_monthly$SEM[-nrow(data_monthly)])
              ,SEM_l12=c(rep(NA,12),data_monthly$SEM[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,SEM_l13=c(rep(NA,13),data_monthly$SEM[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Display_l1=c(rep(NA,1),data_monthly$Display[-nrow(data_monthly)])
              ,Display_l12=c(rep(NA,12),data_monthly$Display[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Display_l13=c(rep(NA,13),data_monthly$Display[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,FB_l1=c(rep(NA,1),data_monthly$FB[-nrow(data_monthly)])
              ,FB_l12=c(rep(NA,12),data_monthly$FB[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,FB_l13=c(rep(NA,13),data_monthly$FB[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Affiliates_l1=c(rep(NA,1),data_monthly$Affiliates[-nrow(data_monthly)])
              ,Affiliates_l12=c(rep(NA,12),data_monthly$Affiliates[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Affiliates_l13=c(rep(NA,13),data_monthly$Affiliates[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ,Partners_l1=c(rep(NA,1),data_monthly$Partners[-nrow(data_monthly)])
              ,Partners_l12=c(rep(NA,12),data_monthly$Partners[-c((nrow(data_monthly)-11):nrow(data_monthly))])
              ,Partners_l13=c(rep(NA,13),data_monthly$Partners[-c((nrow(data_monthly)-12):nrow(data_monthly))])

              ))

data_monthly_log <- cbind(data_monthly[,c("Month","Date")],log(data_monthly[,(names(data_monthly) %in% c("Month","Date"))==FALSE]  ))






source("SubFunctions/forecast_fn_a.R")  #forecast_SARIMAX100100
source("SubFunctions/forecast_fn_b.R")  #forecast_RegUsingLags

#forecast_SARIMAX100100(
#  Channel=ChannelName[i]  #   Channel="SEM"   ; Attr="_LTA"  ; Spending=100000
#, Attr=paste0("_", AttributionModel)
#, Spending = ChannelSpendInput[i]*ChannelScalingFactor[i] 
#, SkipMonths  
#, planMonths
#, IncludeDataForThePeriod
#) 
#forecast_RegUsingLags(
#  Channel=ChannelName[i]  #   Channel="SEM"   ; Attr="_LTA"  ; Spending=100000
#, Attr=paste0("_", AttributionModel)
#, Spending = ChannelSpendInput[i]*ChannelScalingFactor[i] 
#, SkipMonths  
#, planMonths
#, IncludeDataForThePeriod
#)
                                   



#########################################################################
#########################################################################
#########################################################################
#ls_SARIMAX100100 <- c()
ls_RegUsingLags<- c("Affiliates_LTA", "Partners_LTA", "Partners_MTA")

revPred_allchannel = NULL
for (i in 1: length(ChannelName)) {
if(paste0(ChannelName[i],"_", AttributionModel) %in% ls_RegUsingLags){
                revPred_allchannel = c( revPred_allchannel,                        
                                        forecast_RegUsingLags(
                                                Channel=ChannelName[i]  #   Channel="SEM"   ; Attr="_LTA"  ; Spending=100000
                                              , Attr=paste0("_", AttributionModel)
                                              , Spending = ChannelSpendInput[i]*ChannelScalingFactor[i] 
                                              , SkipMonths  
                                              , planMonths
                                              , IncludeDataForThePeriod
                                        )
                                      )
                }else{
                revPred_allchannel = c( revPred_allchannel,                        
                                        forecast_SARIMAX100100(
                                                Channel=ChannelName[i]  #   Channel="SEM"   ; Attr="_LTA"  ; Spending=100000
                                              , Attr=paste0("_", AttributionModel)
                                              , Spending = ChannelSpendInput[i]*ChannelScalingFactor[i] 
                                              , SkipMonths  
                                              , planMonths
                                              , IncludeDataForThePeriod
                                        )
                                      )
                      
}

} #for (i in 1: length(ChannelName)) 


PR <- revPred_allchannel
PR <- c(PR, sum(PR))
names(PR) <- paste0(PRChannel, "PR")
return(PR)


} #Run_1_Forecast


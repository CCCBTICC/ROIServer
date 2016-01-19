###################################################################################################################
###################### Run_1_Forecast: Function of Forecasting Channel Revenue  ###################################
###################################################################################################################                                                                                     #

Run_1_Forecast <- function(
Beg_Date      = Beg_Date,
End_Date      = End_Date, 
Inputfile     = Inputfile,
Fstfile       = Fstfile,
Date          = Date
)

{
options(warn = -1)


#Inputfile     = "RROI_input_data.csv"
#Fstfile       = "RROI_elasticity_table.csv"


########################## I/O Paths #####################################################################
# Input Historical Spending/Revenue
  InputSpendingPath = Inputfile

# Input Parameter
  InputParaPath     = Fstfile


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


## Read parameter data
data3 = read.csv(file =  InputParaPath, as.is = T)
beta1   = data3[data3$Channel %in% ChannelRevenue & data3$planMonths == planMonths, paste0("beta_", gsub("\\-", "", Beg_Date))]

print(beta1)
#Change negative elasticity to the row average
#beta1 order:SEM, Display, FB, Affiliates, Partners
#channelrevenue planmonth average
#Affiliates_MTA	1    0.095885806
#Display_LTA      3    0.272175565
#Partners_LTA	3    0.908678065
#Affiliates_MTA	3    0.275485895
       if( any(beta1<0) & planMonths==1 & AttributionModel=='MTA') {      
beta1[4] <-  0.095885806
} else if( any(beta1<0) & planMonths==3 & AttributionModel=='LTA') {  
beta1[2] <-  0.272175565
beta1[5] <-  0.908678065
} else if( any(beta1<0) & planMonths==3 & AttributionModel=='MTA') { 
beta1[4] <-  0.275485895
} 

print(beta1)



########################## Read Historical Data For Forecast #############################################

## Read spending input
data      = read.csv(file =  InputSpendingPath, as.is = T)
data$Date = as.Date(data$Date, "%m/%d/%Y")
data = data[data$Date < as.Date(Beg_Date),]

## Deal with date
data$cmonth = format(data[, Date],'%b') #viva: month of year
data$MONTH  = as.numeric(factor(data$cmonth,
                               levels = c("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"),
                               ordered=TRUE))  #Jan, Feb, Mar, ...
data$YEAR   =  as.numeric(as.character(factor(format(data[, Date],'%Y'),ordered=TRUE)))
# make all numbers to 2 digits by padding with 0
leftpad = function(x) 
{
    if (nchar(x) == 2) {y = paste0(x)}
    if (nchar(x) < 2)  {y = paste0('0' ,x)}
    return(y)
}
# absolute month number as a factor
data$monthcnt = as.numeric(factor(paste0(data$YEAR, sapply(data$MONTH, leftpad)), ordered = T))

## Read revenue data
#data2      = read.csv(file =  InputRevenuePath, as.is = T)
#data2$Date = as.Date(data2$Date, "%m/%d/%Y")

## Merge Spending and Revenue
#data = merge(data,  data2,  by.x = "Date", by.y = "Date", all.x = F, all.y = F, sort = F)

tmpchannel <- c("Revenue", "Display", "SEM", "SEMBrand", "SEMCard", "SEMPBook", "SEMOther",
                "Partners", "Affiliate", "FB", "DM",  "TV", "TVImpression", 
                "Display_MTA", "SEM_MTA", "Partners_MTA", "Affiliates_MTA", "FB_MTA", 
                "Display_LTA", "SEM_LTA", "Partners_LTA", "Affiliates_LTA", "FB_LTA")
data[, tmpchannel] <- apply(data[, tmpchannel], 2, function(x) ifelse(x <=0, 1, x))






################################################## SimModel4Forecast Method ########################################################
########################## SimModel4Forecast: log(revenue)=(log(spend)-log(spend__LstY))* beta + revenue_LstY + revGrowth_LstM #######################
SimModel4Forecast_singlechannel = function(ChannelRevenue, ChannelSpendInput, ChannelScalingFactor, ChannelName, beta1, Start_YYYY_MM, planMonths) {


########################## SimModel4Forecast to get single channel rev prediction ######################################
SimModel4Forecast = function(ChannelRevenue, ChannelSpendInput, ChannelScalingFactor, ChannelName, beta1, Start_YYYY_MM, planMonths) {
    # ChannelRevenue: name of channel revenue
    # ChannelName: name of channel spending
    # Start_YYYY_MM: starting YYYY-MM
    # beta1: the parameter equivalent to elasticity
    # planMonths: number of month in advance for prediction
    # Value: predicted revenue
    
    ## Get data needed for forecast; Data of the last time point is to be forecast
    data4Forecast = dataInput[dataInput$Date <=  as.Date(Start_YYYY_MM), ]
    data4Forecast[data4Forecast$Date == as.Date(Start_YYYY_MM), ChannelRevenue] = NA
    # Use spending and factor given by user
    data4Forecast[data4Forecast$Date == as.Date(Start_YYYY_MM), ChannelName]    = ChannelScalingFactor * ChannelSpendInput
    
    ## Get data of previous year
    # edit-20140724: convert to ln scale
    dataLn          = data4Forecast
    dataLn[, c(ChannelName, ChannelRevenue)] = log(dataLn[, c(ChannelName, ChannelRevenue)])
    dataShift       = dataLn 
    dataShift$YEAR     = dataShift$YEAR + 1
    dataShift$monthcnt = NULL
    names(dataShift)[!names(dataShift) %in% c("YEAR", "MONTH")] = 
        sapply(names(dataShift)[!names(dataShift) %in% c("YEAR", "MONTH")], paste0, "_LstY", sep = "")
    # Left join original and shifted data, so that channel_LstY is data of the last year
    dataMonthlyTemp    = merge(dataLn, dataShift, by = c("YEAR", "MONTH"), all.x = T, all.y = F, sort = T)
    dataMonthlyTemp$peak= ifelse(is.na(dataMonthlyTemp$peak),  dataMonthlyTemp$peak_LstY, dataMonthlyTemp$peak)

    ## edit-20140724: The model for ln scale
    dataMonthlyTemp$revAdj    = 
        (dataMonthlyTemp[, ChannelName] - dataMonthlyTemp[, paste0(ChannelName, "_LstY", sep = "")]) * beta1 + 
        dataMonthlyTemp[, paste0(ChannelRevenue, "_LstY", sep = "")]

    dataMonthlyTemp$revGrowth = dataMonthlyTemp[, ChannelRevenue] - dataMonthlyTemp$revAdj
    
    # Get data of previous months
    dataShift2          = dataMonthlyTemp[, c("revGrowth", "monthcnt")]
    dataShift2$monthcnt = dataMonthlyTemp$monthcnt + planMonths
    names(dataShift2)[!names(dataShift2) %in% c("monthcnt")] = 
        sapply(names(dataShift2)[!names(dataShift2) %in% c("monthcnt")], paste0, "_LstM", sep = "")
    # Left join original and shifted data, so that channel_LstM is data planMonths before
    dataMonthlyTemp     = merge(dataMonthlyTemp, dataShift2, by = "monthcnt", all.x = T, all.y = F, sort = T)
    
    # return predicted revenue
    # edit-20140724: convert predicted revenue from ln scale
    dataMonthlyTemp$revPred  = dataMonthlyTemp$revGrowth_LstM + dataMonthlyTemp$revAdj
    return(exp(dataMonthlyTemp$revPred[length(dataMonthlyTemp$revPred)]))
}
#SimModel4Forecast



## Compute monthly spend/revenue (sum of daily, not mean)
# computer monthly total for specified channel
ChannelRevenue = paste0(ChannelName, "_", AttributionModel)
# The name of "Affiliates/Affiliate" is not consistent in input file; The next line deals with it
if (ChannelName == "Affiliates") ChannelName = "Affiliate"
# Sum up to get monthly data
dataMonthlyNoTime = aggregate(data[, c(ChannelName, ChannelRevenue)], list(monthcnt = data$monthcnt), sum)
# Attach YEAR and MONTH as factors
timeData    = aggregate(data[, c("YEAR", "MONTH", "Date")], list(monthcnt = data$monthcnt), min)
dataMonthly = merge(dataMonthlyNoTime, timeData,  by.x = "monthcnt", by.y = "monthcnt", all.x = F, all.y = F, sort = F)
          
            dataMonthly$peak = ifelse(dataMonthly$MONTH %in% c(10, 11, 12), 1, 0)

# Remove Date temporarily, because 2m/3m data cannot deal with it
tmpDate = dataMonthly$Date;
dataMonthly$Date = NULL

## Get bi-/tri-monthly data for 2m/3m forecast
if (planMonths == 1) {
    dataInput      = dataMonthly
    dataInput$Date = tmpDate
} else if (planMonths == 2) {
    ## Compute bimonthly spend/revenue (summing up consecutive months)
    dataBiMonthly           = dataMonthly[-1, ] + dataMonthly[-dim(dataMonthly)[1], ]
    dataBiMonthly$monthcnt  = dataMonthly$monthcnt[-dim(dataMonthly)[1]]
    dataBiMonthly$YEAR      = dataMonthly$YEAR[-dim(dataMonthly)[1]]
    dataBiMonthly$MONTH     = dataMonthly$MONTH[-dim(dataMonthly)[1]]
    dataBiMonthly$Date      = tmpDate[-dim(dataMonthly)[1]]
    dataInput               = dataBiMonthly
} else if (planMonths == 3) {
    ## Compute trimonthly spend/revenue (summing up consecutive months)
    dataTriMonthly          = dataMonthly[-c(1, 2), ] + dataMonthly[-c(1, dim(dataMonthly)[1]), ] + 
                                dataMonthly[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1]), ]
    dataTriMonthly$monthcnt = dataMonthly$monthcnt[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]    
    dataTriMonthly$YEAR     = dataMonthly$YEAR[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]
    dataTriMonthly$MONTH    = dataMonthly$MONTH[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]
    dataTriMonthly$Date     = tmpDate[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]
    dataInput               = dataTriMonthly
}

## Extend the historical data by 1 year in advance; This makes the prediction implementation easier
yy = NULL
for (ii in dataInput$YEAR[1]:(dataInput$YEAR[length(dataInput$YEAR)] + 1)) {
    yy = rbind(yy, data.frame(YEAR = ii, MONTH = 1:12))
}
yy$Date            = as.Date(paste(yy$YEAR, substring(yy$MONTH + 100, 2, 3), "01", sep = "-"), "%Y-%m-%d")
dataInput          = merge(yy, dataInput, by = c("YEAR", "MONTH", "Date"), all.x = T, all.y = F, sort = T)
dataInput$monthcnt = 1:dim(dataInput)[1]


## Get predicted revenue
revPred = SimModel4Forecast(ChannelRevenue,  ChannelSpendInput, ChannelScalingFactor, ChannelName, 
                   beta1, Start_YYYY_MM,  planMonths )    
print(revPred)
}#SimModel4Forecast_singlechannel
################################################## SimModel4Forecast Method ########################################################






###################################################### NOT USED ANY MORE ############################################################
##################################################### RatioMethod ###################################################################			
############### RatioMethod : this year revenue = this year spend * last year revenue/last year spend ############################	

 RatioMethod = function (ChannelName, AttributionModel, StartingDate, planMonths, ChannelSpendInput, ChannelScallingFactor ){	
    dataMonthlyNoTime = aggregate(data[,  c("FB", "FB_LTA","FB_MTA")], list(monthcnt = data$monthcnt), sum)	
    timeData  = aggregate(data[, c("YEAR", "MONTH")], list(monthcnt = data$monthcnt), min) 	
    data1  = merge(dataMonthlyNoTime,  timeData,  by.x = "monthcnt", by.y = "monthcnt",  all.x = F, all.y = F, sort = F)  	

    tmpYEAR  = year(as.Date(StartingDate))
    tmpMONTH = month(as.Date(StartingDate))

    Spend = ChannelSpendInput * ChannelScallingFactor	

    if (planMonths == 1) {	

        dataInput = data1	
        LY_ind   = (dataInput$YEAR == tmpYEAR-1 & dataInput$MONTH == tmpMONTH)
        TY_ind   = (dataInput$YEAR == tmpYEAR   & dataInput$MONTH == tmpMONTH)


      } else if (planMonths == 2) {	
        data2           = data1[-1, ] + data1[-dim(data1)[1], ]	
        data2$monthcnt  = data1$monthcnt[-dim(data1)[1]]	
        data2$YEAR       = data1$YEAR[-dim(data1)[1]]	
        data2$MONTH    = data1$MONTH[-dim(data1)[1]]	
        dataInput             = data2     
        LY_ind   = (dataInput$YEAR == tmpYEAR-1 & dataInput$MONTH == tmpMONTH)
        TY_ind   = (dataInput$YEAR == tmpYEAR   & dataInput$MONTH == tmpMONTH)
   	
 	
     } else if (planMonths == 3) {	
        ## Compute trimonthly spend/revenue (summing up consecutive months)	
        data3          = data1[-c(1, 2), ] + data1[-c(1, dim(data1)[1]), ] + 	
        data1[-c(dim(data1)[1] - 1, dim(data1)[1]), ]	
        data3 $monthcnt = data1$monthcnt[-c(dim(data1)[1] - 1, dim(data1)[1])]    	
        data3 $YEAR      = data1$YEAR[-c(dim(data1)[1] - 1, dim(data1)[1])]	
        data3 $MONTH   = data1$MONTH[-c(dim(data1)[1] - 1, dim(data1)[1])]	
        dataInput             = data3 
        LY_ind   = (dataInput$YEAR == tmpYEAR-1 & dataInput$MONTH == tmpMONTH)
        TY_ind   = (dataInput$YEAR == tmpYEAR   & dataInput$MONTH == tmpMONTH)
		
      }  

        r = log(dataInput[LY_ind, paste0(ChannelName,"_",AttributionModel)])/log(dataInput[LY_ind, ChannelName])	
	
       PredictedRevenue = exp(log(Spend) * r	)
       #error = abs((PredictedRevenue - dataInput[TY_ind, paste0(ChannelName,"_",AttributionModel)])/ dataInput[TY_ind, paste0(ChannelName,"_",AttributionModel)])	
       #result = round(c(PredictedRevenue, error),digit = 3)	
       #return (result)	
        print(PredictedRevenue)
        return(PredictedRevenue)	
  }	# RatioMethod
		
############################################ RatioMethod #################################################################	
############################################# NOT USED ANY MORE ##########################################################	




############################################ LogReg Method ###################################################################
########################## LogReg Method: log(revenue) = (log(spend) + peak) * beta + revGrowth_LstM #########################
LogReg_singlechannel = function(ChannelRevenue, ChannelSpendInput, ChannelScalingFactor, ChannelName, beta1, Start_YYYY_MM, planMonths) {

########################## LogReg to get single channel rev prediction ######################################
LogReg = function(ChannelRevenue, ChannelSpendInput, ChannelScalingFactor, ChannelName, beta1, Start_YYYY_MM, planMonths) {
    # ChannelRevenue: name of channel revenue
    # ChannelName: name of channel spending
    # Start_YYYY_MM: starting YYYY-MM
    # beta1: the parameter equivalent to elasticity
    # planMonths: number of month in advance for prediction
    # Value: predicted revenue
    
    ## Get data needed for forecast; Data of the last time point is to be forecast
    data4Forecast = dataInput[dataInput$Date <=  as.Date(Start_YYYY_MM), ]
    #data4Forecast[data4Forecast$Date == as.Date(Start_YYYY_MM), ChannelRevenue] = NA
    # Use spending and factor given by user
    #data4Forecast[data4Forecast$Date == as.Date(Start_YYYY_MM), ChannelName]    = ChannelScalingFactor * ChannelSpendInput
    
    ## Get data of previous year
    # edit-20140724: convert to ln scale
    dataLn          = data4Forecast
    dataLn[, c(ChannelName, ChannelRevenue)] = log(dataLn[, c(ChannelName, ChannelRevenue)])
    dataShift       = dataLn 
    dataShift$YEAR     = dataShift$YEAR + 1
    dataShift$monthcnt = NULL
    names(dataShift)[!names(dataShift) %in% c("YEAR", "MONTH")] = 
        sapply(names(dataShift)[!names(dataShift) %in% c("YEAR", "MONTH")], paste0, "_LstY", sep = "")
    # Left join original and shifted data, so that channel_LstY is data of the last year
    dataMonthlyTemp    = merge(dataLn, dataShift, by = c("YEAR", "MONTH"), all.x = T, all.y = F, sort = T)
    dataMonthlyTemp$peak= ifelse(is.na(dataMonthlyTemp$peak),  dataMonthlyTemp$peak_LstY, dataMonthlyTemp$peak)


    dataMonthlyTemp$revAdj  = dataMonthlyTemp[, ChannelName] * beta1 + dataMonthlyTemp$peak * beta1 

    dataMonthlyTemp$revGrowth = dataMonthlyTemp[, ChannelRevenue] - dataMonthlyTemp$revAdj
    
    # Get data of previous months
    dataShift2          = dataMonthlyTemp[, c("revGrowth", "monthcnt")]
    dataShift2$monthcnt = dataMonthlyTemp$monthcnt + planMonths
    names(dataShift2)[!names(dataShift2) %in% c("monthcnt")] = 
        sapply(names(dataShift2)[!names(dataShift2) %in% c("monthcnt")], paste0, "_LstM", sep = "")
    # Left join original and shifted data, so that channel_LstM is data planMonths before
    dataMonthlyTemp     = merge(dataMonthlyTemp, dataShift2, by = "monthcnt", all.x = T, all.y = F, sort = T)
    
    # return predicted revenue
    # edit-20140724: convert predicted revenue from ln scale
    dataMonthlyTemp$revPred  = dataMonthlyTemp$revGrowth_LstM + dataMonthlyTemp$revAdj
    dataMonthlyTemp$peak = (dataMonthlyTemp[, ChannelRevenue] - dataMonthlyTemp$revGrowth_LstM)/beta1 - dataMonthlyTemp[, ChannelName]
    dataMonthlyTemp$revAdj  = dataMonthlyTemp[, ChannelName] * beta1 + dataMonthlyTemp$peak * beta1
    dataMonthlyTemp$revPred =  dataMonthlyTemp$revGrowth_LstM + dataMonthlyTemp$revAdj
 
    Start_LastYear <- paste0(year(as.Date(Start_YYYY_MM))-1, "-", month(as.Date(Start_YYYY_MM)), "-01")
                  dataMonthlyTemp[dataMonthlyTemp$Date == as.Date(Start_YYYY_MM),]$peak=
     ifelse(is.na(dataMonthlyTemp[dataMonthlyTemp$Date == as.Date(Start_YYYY_MM),]$peak),  
                  dataMonthlyTemp[dataMonthlyTemp$Date == as.Date(Start_LastYear),]$peak, 
                  dataMonthlyTemp[dataMonthlyTemp$Date == as.Date(Start_YYYY_MM),]$peak)

     dataMonthlyTemp[dataMonthlyTemp$Date == as.Date(Start_YYYY_MM),]$revPred = 
     dataMonthlyTemp[dataMonthlyTemp$Date == as.Date(Start_YYYY_MM),]$revGrowth_LstM +
     log(ChannelScalingFactor * ChannelSpendInput) * beta1 + dataMonthlyTemp[data4Forecast$Date == as.Date(Start_YYYY_MM),]$peak* beta1

    return(exp(dataMonthlyTemp[dataMonthlyTemp$Date == as.Date(Start_YYYY_MM),]$revPred))
}
#LogReg


## USE ALL DATA THROUGH 2014-06-30
## Read spending input 
data      = read.csv(file =  InputSpendingPath, as.is = T)
data$Date = as.Date(data$Date, "%m/%d/%Y")
data = data[data[,Date] >= as.Date('2012-10-01'),]
dim(data)

## Deal with date
data$cmonth = format(data[, Date],'%b') #viva: month of year
data$MONTH  = as.numeric(factor(data$cmonth,
                               levels = c("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"),
                               ordered=TRUE))  #Jan, Feb, Mar, ...
data$YEAR   =  as.numeric(as.character(factor(format(data[, Date],'%Y'),ordered=TRUE)))
# make all numbers to 2 digits by padding with 0
leftpad = function(x) 
{
    if (nchar(x) == 2) {y = paste0(x)}
    if (nchar(x) < 2)  {y = paste0('0' ,x)}
    return(y)
}
# absolute month number as a factor
data$monthcnt = as.numeric(factor(paste0(data$YEAR, sapply(data$MONTH, leftpad)), ordered = T))

tmpchannel <- c("Revenue", "Display", "SEM", "SEMBrand", "SEMCard", "SEMPBook", "SEMOther",
                "Partners", "Affiliate", "FB", "DM",  "TV", "TVImpression", 
                "Display_MTA", "SEM_MTA", "Partners_MTA", "Affiliates_MTA", "FB_MTA", 
                "Display_LTA", "SEM_LTA", "Partners_LTA", "Affiliates_LTA", "FB_LTA")
data[, tmpchannel] <- apply(data[, tmpchannel], 2, function(x) ifelse(x <=0, 1, x))


## Compute monthly spend/revenue (sum of daily, not mean)
# computer monthly total for specified channel
ChannelRevenue = paste0(ChannelName, "_", AttributionModel)
# The name of "Affiliates/Affiliate" is not consistent in input file; The next line deals with it
if (ChannelName == "Affiliates") ChannelName = "Affiliate"
# Sum up to get monthly data
dataMonthlyNoTime = aggregate(data[, c(ChannelName, ChannelRevenue)], list(monthcnt = data$monthcnt), sum)
# Attach YEAR and MONTH as factors
timeData    = aggregate(data[, c("YEAR", "MONTH", "Date")], list(monthcnt = data$monthcnt), min)
dataMonthly = merge(dataMonthlyNoTime, timeData,  by.x = "monthcnt", by.y = "monthcnt", all.x = F, all.y = F, sort = F)
dataMonthly$peak = ifelse(dataMonthly$MONTH %in% c(10, 11, 12), 1, 0)
# Remove Date temporarily, because 2m/3m data cannot deal with it
tmpDate = dataMonthly$Date;
dataMonthly$Date = NULL
dim(dataMonthly)

    ## Compute bimonthly spend/revenue (summing up consecutive months)
    dataBiMonthly           = dataMonthly[-1, ] + dataMonthly[-dim(dataMonthly)[1], ]
    dataBiMonthly$monthcnt  = dataMonthly$monthcnt[-dim(dataMonthly)[1]]
    dataBiMonthly$YEAR      = dataMonthly$YEAR[-dim(dataMonthly)[1]]
    dataBiMonthly$MONTH     = dataMonthly$MONTH[-dim(dataMonthly)[1]]
    dataBiMonthly$Date      = tmpDate[-dim(dataMonthly)[1]]
    dim(dataBiMonthly) 
    
    ## Compute trimonthly spend/revenue (summing up consecutive months)
    dataTriMonthly          = dataMonthly[-c(1, 2), ] + dataMonthly[-c(1, dim(dataMonthly)[1]), ] + 
                                dataMonthly[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1]), ]
    dataTriMonthly$monthcnt = dataMonthly$monthcnt[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]    
    dataTriMonthly$YEAR     = dataMonthly$YEAR[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]
    dataTriMonthly$MONTH    = dataMonthly$MONTH[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]
    dataTriMonthly$Date     = tmpDate[-c(dim(dataMonthly)[1] - 1, dim(dataMonthly)[1])]
    dim(dataTriMonthly)

## Get bi-/tri-monthly data for 2m/3m forecast
if (planMonths == 1) {
    dataInput      = dataMonthly
    dataInput$Date = tmpDate
} else if (planMonths == 2) {
    dataInput               = dataBiMonthly
} else if (planMonths == 3) {
    dataInput               = dataTriMonthly
}

## Extend the historical data by 1 year in advance; This makes the prediction implementation easier
yy = NULL
for (ii in dataInput$YEAR[1]:(dataInput$YEAR[length(dataInput$YEAR)] + 1)) {
    yy = rbind(yy, data.frame(YEAR = ii, MONTH = 1:12))
}
yy$Date            = as.Date(paste(yy$YEAR, substring(yy$MONTH + 100, 2, 3), "01", sep = "-"), "%Y-%m-%d")
dataInput          = merge(yy, dataInput, by = c("YEAR", "MONTH", "Date"), all.x = T, all.y = F, sort = T)
dataInput$monthcnt = 1:dim(dataInput)[1]


## Get predicted revenue
revPred = LogReg(ChannelRevenue,  ChannelSpendInput, ChannelScalingFactor, ChannelName, beta1, Start_YYYY_MM,  planMonths )    
print(revPred)
}#LogReg_singlechannel
############################################ LogReg Method #################################################################


revPred_allchannel = NULL
for (i in 1: length(ChannelName)) {
if (ChannelName[i]=='FB') {
revPred_allchannel = c(revPred_allchannel, 
                 LogReg_singlechannel(ChannelRevenue[i], ChannelSpendInput[i], ChannelScalingFactor[i], ChannelName[i], beta1[i], Start_YYYY_MM, planMonths))
} else {
revPred_allchannel = c(revPred_allchannel, 
      SimModel4Forecast_singlechannel(ChannelRevenue[i], ChannelSpendInput[i], ChannelScalingFactor[i], ChannelName[i],  beta1[i], Start_YYYY_MM, planMonths))
} 
} #for (i in 1: length(ChannelName)) 


PR <- revPred_allchannel
PR <- c(PR, sum(PR))
names(PR) <- paste0(PRChannel, "PR")
return(PR)


} #Run_1_Forecast


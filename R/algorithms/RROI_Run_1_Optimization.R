
###################################################################################################################
###################### Run_1_Optimization: Function of Optimization of Total Revenue ##############################         
###################################################################################################################                                                                                     #


Run_1_Optimization <- function(
Beg_Date      = Beg_Date,
End_Date      = End_Date, 
Inputfile     = Inputfile,
Estfile       = Estfile ,
Date          = Date
)

{
require.package<-function(pckg)
{
package.installed<-try(require(pckg, character.only =TRUE))
if (!package.installed) {
cat(paste("Installing", pckg,  "from CRAN\n", sep=" "))
install.packages(pckg,  repos = "http://cran.r-project.org")
require(pckg, character.only =TRUE)
}#if
}#require.package

require.package("Rsolnp")
require.package("caTools")
require.package("compiler")
require.package("nloptr") 
require.package("lubridate")
#require.package("sqldf")
 
#started turning any function we run into byte-code. To turn the JIT back off use enableJIT(0)
enableJIT(3)	
			

InputDataPath  = rCodeFolder    ##### Input Spending
ParametersPath = rCodeFolder          ##### Input Fitted Parameters 
OutputPath     = rCodeFolder                       ##### Saved optimal spending

#tempind <- is.na(as.numeric(inJsonData[paste0(ChannelOut, "Min")]))
#inJsonData[paste0(ChannelOut, "Min")][tempind] <- inJsonData[paste0(ChannelOut, "LB")][tempind]
#tempind <- is.na(as.numeric(inJsonData[paste0(ChannelOut, "Max")]))
#inJsonData[paste0(ChannelOut, "Max")][tempind] <- inJsonData[paste0(ChannelOut, "UB")][tempind]


#---------------------------------------------------------------------------------
#---------------------------------   User Input   --------------------------------
#---------------------------------------------------------------------------------

#### DO NOT Change Variable Names ####

####Total_Budget: 1) unit = 1 dollar; 2) Should NOT include TV, but include DM
Total_Budget = as.numeric(inJsonData$Spend)				
TotalTVImpression = as.numeric(inJsonData$tvImpressions)

#Start_Date   = as.Date("2014-01-01")      #### date format: YYYY-MM-01 
Start_Date   = as.Date(Beg_Date)
#Duration     = 3				                #### unit = month; Must be >= 1 and <=3
Duration     = as.numeric(inJsonData$PlanMonths)

Min_Spend = list(			             #### unit = dollar
SEM_Brand = as.numeric(inJsonData$semBMin),			           #### Put NA if missing
SEM_Card  = as.numeric(inJsonData$semCMin), 
SEM_PBook = as.numeric(inJsonData$semPMin), 
SEM_Other = as.numeric(inJsonData$semOMin), 
Display   = as.numeric(inJsonData$disMin), 
Affiliates= as.numeric(inJsonData$affMin), 
FB        = as.numeric(inJsonData$socMin), 
Partner   = as.numeric(inJsonData$parMin)
)

Max_Spend = list(				           #### unit = dollar
SEM_Brand = as.numeric(inJsonData$semBMax),			           #### Put NA if missing
SEM_Card  = as.numeric(inJsonData$semCMax), 
SEM_PBook = as.numeric(inJsonData$semPMax), 
SEM_Other = as.numeric(inJsonData$semOMax), 
Display   = as.numeric(inJsonData$disMax), 
Affiliates= as.numeric(inJsonData$affMax), 
FB        = as.numeric(inJsonData$socMax), 
Partner   = as.numeric(inJsonData$parMax)
)


#--------------------- Scaling factor is not implemented, since it only affects the projected channel revenue ----------------------
Scaling_Factor = list(	           #### 1.0 as default if no user input
SEM_Brand = as.numeric(inJsonData$semBSF),			             #### Channel with Scaling Factor > 1.0 is more efficient, e.g. CPC/CPM is cheaper. 
SEM_Card  = as.numeric(inJsonData$semCSF), 
SEM_PBook = as.numeric(inJsonData$semPSF), 
SEM_Other = as.numeric(inJsonData$semOSF), 
Display   = as.numeric(inJsonData$disSF), 
Affiliates= as.numeric(inJsonData$affSF), 
FB        = as.numeric(inJsonData$socSF), 
Partner   = as.numeric(inJsonData$parSF)
)


### Set DM spend
DM_Month1  = as.numeric(gsub(",", "",inJsonData$dirSpendM1))             #### Input DM spend for each of 3 months in Duration. If Duration = 1, then ignore month2 and month3.
DM_Month2  = as.numeric(gsub(",", "",inJsonData$dirSpendM2))            #### If Duration = 2, then ignore month3.
DM_Month3  = as.numeric(gsub(",", "",inJsonData$dirSpendM3)) 

if (is.na(DM_Month1)| DM_Month1==0) DM_Month1 = 1      
if (is.na(DM_Month2)| DM_Month2==0) DM_Month2 = 1
if (is.na(DM_Month3)| DM_Month3==0) DM_Month3 = 1

if (Duration == 1)
{
  dm = DM_Month1
} else if (Duration == 2)
{
  dm = c(DM_Month1, DM_Month2)
} else
{
  dm = c(DM_Month1, DM_Month2, DM_Month3)
}



TV_ON = (!is.na(as.numeric(inJsonData$tvImpressions)) && as.numeric(inJsonData$tvImpressions)!=0)     #### 1/0 according to TV ON/OFF. If ON, then the user should choose the Date and Total Impressions. 
#### If OFF, the user can ingore the following part.
#TV_ON:  if tvImpressions not blank and not zero. 
#TV_OFF: if tvImpressions blank or zero


TV_Begin_Date = as.Date(Beg_Date)     ### Set to arbitrary date for easier implementation
TV_End_Date   = as.Date(Beg_Date) 
TV_Total_Impressions = 1  ### Set TV impression to be 1 


if(inJsonData$tvBeginDate !="")   TV_Begin_Date = as.Date(inJsonData$tvBeginDate)
if(inJsonData$tvEndDate   !="")   TV_End_Date   = as.Date(inJsonData$tvEndDate)
if(TV_ON) TV_Total_Impressions = as.numeric(inJsonData$tvImpressions)   
#tvImpressions default is 0
#if there is no user input or tvImpressions is 0, we set it to be 1 (unit)

tvWindow = c(TV_Begin_Date-Start_Date+1, TV_End_Date-Start_Date+1) ## TV spend time window
tvDuration = tvWindow[2] - tvWindow[1] + 1



#-------------------------------------------------------------------------------------------
#---------------RUN THE FOLLOWING PART ALL TOGETHER; DO NOT MODIFY THE FOLLOWING PART ------
#-------------------------------------------------------------------------------------------

#-------------------------------------------------------------------------------------------
#--------------------------- Define Global Variables ---------------------------------------
#-------------------------------------------------------------------------------------------

### If Min_Spend == Max_Spend, then the channel will be treated as fixed ###
#######Min, Max affects InEquConstraint
#######FixedChannel affects EqualConstraint
FixedChannel = list()
if (!is.na(Min_Spend$SEM_Brand + Max_Spend$SEM_Brand) & Min_Spend$SEM_Brand == Max_Spend$SEM_Brand) FixedChannel$SEM_Brand = 1 else FixedChannel$SEM_Brand = 0
if (!is.na(Min_Spend$SEM_Card + Max_Spend$SEM_Card)  & Min_Spend$SEM_Card == Max_Spend$SEM_Card)    FixedChannel$SEM_Card = 1 else FixedChannel$SEM_Card = 0
if (!is.na(Min_Spend$SEM_PBook + Max_Spend$SEM_PBook) & Min_Spend$SEM_PBook == Max_Spend$SEM_PBook) FixedChannel$SEM_PBook = 1 else FixedChannel$SEM_PBook = 0
if (!is.na(Min_Spend$SEM_Other + Max_Spend$SEM_Other) & Min_Spend$SEM_Other == Max_Spend$SEM_Other) FixedChannel$SEM_Other = 1 else FixedChannel$SEM_Other = 0
if (!is.na(Min_Spend$Display + Max_Spend$Display) & Min_Spend$Display == Max_Spend$Display)         FixedChannel$Display = 1 else FixedChannel$Display = 0
if (!is.na(Min_Spend$Affiliates + Max_Spend$Affiliates) & Min_Spend$Affiliates == Max_Spend$Affiliates) FixedChannel$Affiliates = 1 else FixedChannel$Affiliates = 0
if (!is.na(Min_Spend$FB + Max_Spend$FB) & Min_Spend$FB == Max_Spend$FB)                            FixedChannel$FB = 1 else FixedChannel$FB = 0
if (!is.na(Min_Spend$Partner + Max_Spend$Partner) & Min_Spend$Partner == Max_Spend$Partner)        FixedChannel$Partner = 1 else FixedChannel$Partner = 0


#######In Re-Run, moving slider plays the role of re-defining fixed channel######
if (inJsonData$Algorithm==3) {

inJsonData[ paste0(ChannelOut, 'SR' )]    = gsub(" ", "", inJsonData[ paste0(ChannelOut, 'SR' )])
inJsonData[ paste0(ChannelOut, 'Slide' )] = gsub(" ", "", inJsonData[ paste0(ChannelOut, 'Slide' )])

	if (as.numeric(inJsonData$disSR)!= as.numeric(inJsonData$disSlide))    {
                     Min_Spend$Display = as.numeric(inJsonData$disSlide)  
                     Max_Spend$Display = as.numeric(inJsonData$disSlide)   
                     FixedChannel$Display = 1  }  
	
      if (as.numeric(inJsonData$semBSR)!= as.numeric(inJsonData$semBSlide))    {
                    Min_Spend$SEM_Brand = as.numeric(inJsonData$semBSlide)  
                    Max_Spend$SEM_Brand = as.numeric(inJsonData$semBSlide)   
                    FixedChannel$SEM_Brand = 1  } 
	
      if (as.numeric(inJsonData$semCSR)!= as.numeric(inJsonData$semCSlide))    {
                     Min_Spend$SEM_Card = as.numeric(inJsonData$semCSlide)  
                     Max_Spend$SEM_Card = as.numeric(inJsonData$semCSlide)   
                     FixedChannel$SEM_Card = 1  } 
	
      if (as.numeric(inJsonData$semPSR)!= as.numeric(inJsonData$semPSlide))    {
                    Min_Spend$SEM_PBook = as.numeric(inJsonData$semPSlide)  
                    Max_Spend$SEM_PBook = as.numeric(inJsonData$semPSlide)   
                    FixedChannel$SEM_PBook = 1  } 
	
      if (as.numeric(inJsonData$semOSR)!= as.numeric(inJsonData$semOSlide))    {
                    Min_Spend$SEM_Other = as.numeric(inJsonData$semOSlide)  
                    Max_Spend$SEM_Other = as.numeric(inJsonData$semOSlide)   
                    FixedChannel$SEM_Other = 1  } 
	
      if (as.numeric(inJsonData$parSR)!= as.numeric(inJsonData$parSlide))    {
                     Min_Spend$Partner = as.numeric(inJsonData$parSlide)  
                     Max_Spend$Partner = as.numeric(inJsonData$parSlide)   
                     FixedChannel$Partner = 1  } 

      if (as.numeric(inJsonData$affSR)!= as.numeric(inJsonData$affSlide))    {
                  Min_Spend$Affiliates = as.numeric(inJsonData$affSlide)  
                  Max_Spend$Affiliates = as.numeric(inJsonData$affSlide)   
                  FixedChannel$Affiliates = 1  } 

      if (as.numeric(inJsonData$socSR)!= as.numeric(inJsonData$socSlide))    {
                          Min_Spend$FB = as.numeric(inJsonData$socSlide)  
                          Max_Spend$FB = as.numeric(inJsonData$socSlide)   
                          FixedChannel$FB = 1  }

}#if (inJsonData$Algorithm==3)



#-------------------------------------------------------------------------------------------
#------------------------------ Read input data/parameters  --------------------------------
#-------------------------------------------------------------------------------------------

data = read.csv(file = Inputfile, as.is = T)
data$Date = as.Date(data$Date, "%m/%d/%Y")
#data = data[data$Date < as.Date(Beg_Date),]

dim(data)
tmpchannel <- c("Revenue", "Display", "SEM", "SEMBrand", "SEMCard", "SEMPBook", "SEMOther",
                "Partners", "Affiliate", "FB", "DM", "TV", "TVImpression", 
                "Display_MTA", "SEM_MTA", "Partners_MTA", "Affiliates_MTA", "FB_MTA", 
                "Display_LTA", "SEM_LTA", "Partners_LTA", "Affiliates_LTA", "FB_LTA")
data[, tmpchannel] <- apply(data[, tmpchannel], 2, function(x) ifelse(x <=0, 1, x))
data <- data[, c("Date", tmpchannel)]

data$year = year(data$Date)
data$month = month(data$Date)

# temp = aggregate(data[, tmpchannel], list(year =data$year, month=data$month), sum)
# temp=temp[order(temp$year, temp$month),]
# write.csv(temp,   paste0(Inputfile, "_bymonth.csv"), row.names=F)

#### Get monthly DM spend
#DM_Monthly = sqldf('select year, month, avg(DM) as DM from data group by year, month')
DM_Monthly = aggregate(DM ~ month+year , data=data, FUN=function(x) mean(x, na.rm=T))

#### Get data from Last Year during the same time period, only used for seting up daily spend lower/upper bound in Optimization

choose_LastYear = which(data[,Date] >= as.Date(Beg_Date_LastYear)  & data[,Date] <= as.Date(End_Date_LastYear))
choose_TV_LastYear = which(data$Date >= TV_Begin_Date - 365 & data$Date <= TV_End_Date - 365)
data_LastYear = data[choose_LastYear,]
Spend_LastYear = do.call(c,data_LastYear[, ChannelSpend2])
Spend_LastYear = c(Spend_LastYear, data$TVImpression[choose_TV_LastYear])
length(Spend_LastYear)  #length(Spend_LastYear)=ndays_LastYear * 8 + tvDuration 



#### Get current time period data, it would be missing (=NA) if Start_Date > input date range. 
#### It will not be used anywhere in the program, except for results comparision
choose_CurrentYear = which(data[,Date] >= as.Date(Beg_Date)       & data[,Date] <= as.Date(End_Date))
choose_TV_CurrentYear = which(data$Date >= TV_Begin_Date & data$Date <= TV_End_Date)
data_CurrentYear = data[choose_CurrentYear, ]
Spend_CurrentYear = do.call(c,data_CurrentYear[, ChannelSpend2])
Spend_CurrentYear = c(Spend_CurrentYear, data$TVImpression[choose_TV_CurrentYear])
length(Spend_CurrentYear)  #length(Spend_CurrentYear)=ndays * 8 + tvDuration 


Channel = rep(c("Display", "SEM_Brand", "SEM_Card", "SEM_PBook","SEM_Other","Partner", "Affiliates", "FB", "TV"), 
		   times = c(rep(ndays, 8), tvDuration))

#### Used in the Revenue Function
OneWeekPrior = data[data$Date >= Start_Date-7 & data$Date < Start_Date, c('Display', 'SEMBrand', 'SEMCard', 'SEMOther', 'Partners', 'TV')]
OneWeekPrior$TV = OneWeekPrior$TV+1
OneWeekPrior = as.matrix(OneWeekPrior)
TwoMonthPriorDM = DM_Monthly[(DM_Monthly$month == month(Start_Date-45) & DM_Monthly$year == year(Start_Date-45)) | 
                               (DM_Monthly$month == month(Start_Date-15) & DM_Monthly$year == year(Start_Date-15)), ]$DM


#### Used in the Revnue Function; Calculate DM; Always Use 30 Days for TwoMonthPriorDM for simplicity...
tmpDM = runmean(x = rep(c(TwoMonthPriorDM, dm), times = c(30, 30, dayOfMonth)), k=30, alg="fast", endrule="trim")
dmLag1  = tmpDM[31:(length(tmpDM)-1)]
dmLag30 = tmpDM[1:(length(tmpDM)-31)]



## Define Peak dummy: Start from "Black Friday"; 
outlier11 = ifelse(data[,Date] >= as.Date('2011-11-25') & data[,Date]<= as.Date('2011-12-15'), 1,0)
outlier12 = ifelse(data[,Date] >= as.Date('2012-11-23') & data[,Date]<= as.Date('2012-12-17'), 1,0)
outlier13 = ifelse(data[,Date] >= as.Date('2013-11-29') & data[,Date]<= as.Date('2013-12-16'), 1,0)
outlier14 = ifelse(data[,Date] >= as.Date('2014-11-29') & data[,Date]<= as.Date('2014-12-16'), 1,0)

	
t=1:nrow(data)


tmpquarters <- quarters(data[, "Date"], abbreviate = T)
Q1  <- as.numeric(tmpquarters == 'Q1')  
Q2  <- as.numeric(tmpquarters == 'Q2') 
Q3  <- as.numeric(tmpquarters == 'Q3') 
Q4  <- as.numeric(tmpquarters == 'Q4') 

tmpmonths <- months(data[, "Date"], abbreviate = T)
Mon  <- as.numeric(tmpmonths == 'Mon')  
Feb  <- as.numeric(tmpmonths == 'Feb') 
Mar  <- as.numeric(tmpmonths == 'Mar') 
Apr  <- as.numeric(tmpmonths == 'Apr') 
May  <- as.numeric(tmpmonths == 'May') 
Jun  <- as.numeric(tmpmonths == 'Jun')
Jul  <- as.numeric(tmpmonths == 'Jul')
Aug  <- as.numeric(tmpmonths == 'Aug') 
Sep  <- as.numeric(tmpmonths == 'Sep') 
Oct  <- as.numeric(tmpmonths == 'Oct') 
Nov  <- as.numeric(tmpmonths == 'Nov')
Dec  <- as.numeric(tmpmonths == 'Dec')


tmpweekdays    <- weekdays(data[, "Date"], abbreviate = F)
Sunday    <- as.numeric(tmpweekdays == 'Sunday'   )  
Monday    <- as.numeric(tmpweekdays == 'Monday'   ) 
Tuesday   <- as.numeric(tmpweekdays == 'Tuesday'  ) 
Wednesday <- as.numeric(tmpweekdays == 'Wednesday') 
Thursday  <- as.numeric(tmpweekdays == 'Thursday' ) 
Friday    <- as.numeric(tmpweekdays == 'Friday'   )
Saturday  <- as.numeric(tmpweekdays == 'Saturday' )

Weekday1 <- Sunday   
Weekday2 <- Monday   
Weekday3 <- Tuesday  
Weekday4 <- Wednesday
Weekday5 <- Thursday 
Weekday6 <- Friday   
Weekday7 <- Saturday 


#### Read model parameters
#Estimate = as.list(read.csv(file = Estfile, as.is = T)[2,])
Estimate = read.csv(file = Estfile, as.is = T)
if (any(is.na(as.Date(Estimate$Beg_Date, "%m/%d/%Y")))) Estimate$Beg_Date = as.Date(Estimate$Beg_Date, "%Y-%m-%d")
if (any(!is.na(as.Date(Estimate$Beg_Date, "%m/%d/%Y")))) Estimate$Beg_Date = as.Date(Estimate$Beg_Date, "%m/%d/%Y")
Estimate = as.list(Estimate[Estimate$Beg_Date==as.Date(Beg_Date),])


Estimate$OD   = (Estimate$lOD   + Q2*Estimate$lOD_Q2   + Q3*Estimate$lOD_Q3   + Q4*Estimate$lOD_Q4)[choose_CurrentYear]
Estimate$SEMB = (Estimate$lSEMB + Q2*Estimate$lSEMB_Q2 + Q3*Estimate$lSEMB_Q3 + Q4*Estimate$lSEMB_Q4)[choose_CurrentYear]
Estimate$SEMC = (Estimate$lSEMC + Q2*Estimate$lSEMC_Q2 + Q3*Estimate$lSEMC_Q3 + Q4*Estimate$lSEMC_Q4)[choose_CurrentYear]
Estimate$SEMP = (Estimate$lSEMP + Q2*Estimate$lSEMP_Q2 + Q3*Estimate$lSEMP_Q3 + Q4*Estimate$lSEMP_Q4)[choose_CurrentYear]
Estimate$SEMO = (Estimate$lSEMO + Q2*Estimate$lSEMO_Q2 + Q3*Estimate$lSEMO_Q3 + Q4*Estimate$lSEMO_Q4)[choose_CurrentYear]
Estimate$PA   = (Estimate$lPA   + Q2*Estimate$lPA_Q2   + Q3*Estimate$lPA_Q3   + Q4*Estimate$lPA_Q4)  [choose_CurrentYear]
Estimate$TV   = (Estimate$lTV                                                 + Q4*Estimate$lTV_Q4)  [choose_CurrentYear]
Estimate$FB   = Estimate$lFB  ### Set FB coefficient = 0.01 for now, due to lack of enough data

#### Used in the Revnue Function; Include all seasonal effects and DM effect 
OtherEffects = exp(
          Estimate$Intercept + 
outlier11*Estimate$outlier11 + 
outlier12*Estimate$outlier12 + 
outlier13*Estimate$outlier13 +  
outlier14*Estimate$outlier14 + 
Feb*Estimate$Feb + 
Mar*Estimate$Mar + 
Apr*Estimate$Apr + 
May*Estimate$May + 
Jun*Estimate$Jun + 
Jul*Estimate$Jul + 
Aug*Estimate$Aug + 
Sep*Estimate$Sep + 
Oct*Estimate$Oct + 
Nov*Estimate$Nov + 
Dec*Estimate$Dec + 
Weekday1*Estimate$Weekday1 + 
Weekday2*Estimate$Weekday2 + 
Weekday3*Estimate$Weekday3 + 
Weekday4*Estimate$Weekday4 + 
Weekday5*Estimate$Weekday5 + 
Weekday6*Estimate$Weekday6 + 
t*Estimate$t
)[choose_CurrentYear] * 
dmLag1^Estimate$lDM1 * 
dmLag30^Estimate$lDM30


#-------------------------------------------------------------------------------------------
#--------------------------- Define Temp Variables ---------------------------------------
#-------------------------------------------------------------------------------------------

### Temp variables ##
tv = rep(1,ndays) ## Temp impression vector for TV, used in "Revenue Function"

t1 = ndays*c(1,2,3,4,5,6,7,8)
t2 = c(1, t1+1)

#-------------------------------------------------------------------------------------------
#--------------------------- Define Revenue Response Function ------------------------------
#-------------------------------------------------------------------------------------------

Revenue = function(spend)
{
 ## spend ---- All channel spend in one vector; Spend for TV really means impression for TV here
 ## length(spend) = 8*Duration in Days + TV window

	display = spend[t2[1]:t1[1]]
	semB    = spend[t2[2]:t1[2]]
	semC    = spend[t2[3]:t1[3]]
	semP    = spend[t2[4]:t1[4]]
	semO    = spend[t2[5]:t1[5]]
	pa      = spend[t2[6]:t1[6]]
	af      = spend[t2[7]:t1[7]]
	fb      = spend[t2[8]:t1[8]]

	##TV Impression
	tv[tvWindow[1]:tvWindow[2]]  = spend[t2[9]:length(spend)]

	### last_Week_Spend_Lag ####
	lagLastWeek = runmean(x=rbind(OneWeekPrior, cbind(display, semB, semC, semO, pa, tv)[1:(ndays-1),]), k=7, alg="fast", endrule="trim")

  ## Return negative total revenue
	-sum(
    	display^Estimate$OD * lagLastWeek[,1]^Estimate$lODLW   * 
    	semB^Estimate$SEMB  * lagLastWeek[,2]^Estimate$lSEMBLW * 
    	semC^Estimate$SEMC  * lagLastWeek[,3]^Estimate$lSEMCLW *
    	semP^Estimate$SEMP  *
    	semO^Estimate$SEMO  * lagLastWeek[,4]^Estimate$lSEMOLW *	
    	pa^Estimate$PA      * lagLastWeek[,5]^Estimate$lPALW   *
    	af^Estimate$lAF     *
    	fb^Estimate$FB      *
    	tv^Estimate$TV      * lagLastWeek[,6]^Estimate$lTVLW   *
    	OtherEffects                       
	)
}
Revenue = cmpfun(Revenue)
#-------------------------------------------------------------------------------------------
#---------------------------------  Optimization Step  -------------------------------------
#-------------------------------------------------------------------------------------------
Revenue(Spend_LastYear )
sum(data[choose_LastYear,]$Revenue)


Revenue2 = function(spend)
{
 ## spend ---- All channel spend in one vector; Spend for TV really means impression for TV here
 ## length(spend) = 8*Duration in Days + TV window

	display = spend[t2[1]:t1[1]]
	semB    = spend[t2[2]:t1[2]]
	semC    = spend[t2[3]:t1[3]]
	semP    = spend[t2[4]:t1[4]]
	semO    = spend[t2[5]:t1[5]]
	pa      = spend[t2[6]:t1[6]]
	af      = spend[t2[7]:t1[7]]
	fb      = spend[t2[8]:t1[8]]

	##TV Impression
	tv[tvWindow[1]:tvWindow[2]]  = spend[t2[9]:length(spend)]

	### last_Week_Spend_Lag ####
	lagLastWeek = runmean(x=rbind(OneWeekPrior, cbind(display, semB, semC, semO, pa, tv)[1:(ndays-1),]), k=7, alg="fast", endrule="trim")

  ## Return negative total revenue
	#-sum(
    	display^Estimate$OD * lagLastWeek[,1]^Estimate$lODLW   * 
    	semB^Estimate$SEMB  * lagLastWeek[,2]^Estimate$lSEMBLW * 
    	semC^Estimate$SEMC  * lagLastWeek[,3]^Estimate$lSEMCLW *
    	semP^Estimate$SEMP  *
    	semO^Estimate$SEMO  * lagLastWeek[,4]^Estimate$lSEMOLW *	
    	pa^Estimate$PA      * lagLastWeek[,5]^Estimate$lPALW   *
    	af^Estimate$lAF     *
    	fb^Estimate$FB      *
    	tv^Estimate$TV      * lagLastWeek[,6]^Estimate$lTVLW   *
    	OtherEffects                       
	#)
}


### Total Budget Constraints, excluding DM which is not optimized: HERE TOTAL BUDGET NOT INCLUDING DM ###
TotalBudget = Total_Budget  
TVTotalImp  = TV_Total_Impressions 
#####################################################################################################################
########################################### Run_1 and Run_2 Optimization are different Begins ########################
#####################################################################################################################


### Total budget constraint; total TV impression constraint; channels total constrants that have Min_Spend==Max_Spend in user input ####
EqualConstraint = function(spend)
{
	tmp = c(sum(spend[1:(length(spend)-tvDuration)]) - TotalBudget, sum(spend[(length(spend)-tvDuration+1):length(spend)]) - TVTotalImp)
	
	if (FixedChannel$Display)    tmp = c(tmp, sum(spend[t2[1]:t1[1]]) - Min_Spend$Display)
	if (FixedChannel$SEM_Brand)  tmp = c(tmp, sum(spend[t2[2]:t1[2]]) - Min_Spend$SEM_Brand)
	if (FixedChannel$SEM_Card)   tmp = c(tmp, sum(spend[t2[3]:t1[3]]) - Min_Spend$SEM_Card)
	if (FixedChannel$SEM_PBook)  tmp = c(tmp, sum(spend[t2[4]:t1[4]]) - Min_Spend$SEM_PBook)
	if (FixedChannel$SEM_Other)  tmp = c(tmp, sum(spend[t2[5]:t1[5]]) - Min_Spend$SEM_Other)
	if (FixedChannel$Partner)    tmp = c(tmp, sum(spend[t2[6]:t1[6]]) - Min_Spend$Partner)
	if (FixedChannel$Affiliates) tmp = c(tmp, sum(spend[t2[7]:t1[7]]) - Min_Spend$Affiliates)
	if (FixedChannel$FB)         tmp = c(tmp, sum(spend[t2[8]:t1[8]]) - Min_Spend$FB)
return(tmp)
} #EqualConstraint


### Channel total budget constraint from user input 
InEquConstraint = function(spend){
  tmp = NULL
  
  if (!FixedChannel$Display & !(is.na(Min_Spend$Display) & is.na(Max_Spend$Display)))
  {
    display = sum(spend[t2[1]:t1[1]])
    if (!is.na(Min_Spend$Display))
      tmp = c(tmp, display - Min_Spend$Display)
    if (!is.na(Max_Spend$Display))
      tmp = c(tmp, Max_Spend$Display - display)
  }
  
  if (!FixedChannel$SEM_Brand & !(is.na(Min_Spend$SEM_Brand) & is.na(Max_Spend$SEM_Brand)))
  {
    semB  = sum(spend[t2[2]:t1[2]])
    if (!is.na(Min_Spend$SEM_Brand))
      tmp = c(tmp, semB - Min_Spend$SEM_Brand)
    if (!is.na(Max_Spend$SEM_Brand))
      tmp = c(tmp, Max_Spend$SEM_Brand - semB)
  }
  
  if (!FixedChannel$SEM_Card & !(is.na(Min_Spend$SEM_Card) & is.na(Max_Spend$SEM_Card)))
  {
    semC  = sum(spend[t2[3]:t1[3]])
    if (!is.na(Min_Spend$SEM_Card))
      tmp = c(tmp, semC - Min_Spend$SEM_Card)
    if (!is.na(Max_Spend$SEM_Card))
      tmp = c(tmp, Max_Spend$SEM_Card - semC)
  }
  
  if (!FixedChannel$SEM_PBook & !(is.na(Min_Spend$SEM_PBook) & is.na(Max_Spend$SEM_PBook)))
  {
    semP  = sum(spend[t2[4]:t1[4]])
    if (!is.na(Min_Spend$SEM_PBook))
      tmp = c(tmp, semP - Min_Spend$SEM_PBook)
    if (!is.na(Max_Spend$SEM_PBook))
      tmp = c(tmp, Max_Spend$SEM_PBook - semP)
  }
  if (!FixedChannel$SEM_Other & !(is.na(Min_Spend$SEM_Other) & is.na(Max_Spend$SEM_Other)))
  {
    semO  = sum(spend[t2[5]:t1[5]])
    if (!is.na(Min_Spend$SEM_Other))
      tmp = c(tmp, semO - Min_Spend$SEM_Other)
    if (!is.na(Max_Spend$SEM_Other))
      tmp = c(tmp, Max_Spend$SEM_Other - semO)
  }
  
  if (!FixedChannel$Partner & !(is.na(Min_Spend$Partner) & is.na(Max_Spend$Partner)))
  {
    pa    = sum(spend[t2[6]:t1[6]])
    if (!is.na(Min_Spend$Partner))
      tmp = c(tmp, pa - Min_Spend$Partner)
    if (!is.na(Max_Spend$Partner))
      tmp = c(tmp, Max_Spend$Partner - pa)
  }
  
  if (!FixedChannel$Affiliates & !(is.na(Min_Spend$Affiliates) & is.na(Max_Spend$Affiliates)))
  {
    af    = sum(spend[t2[7]:t1[7]])
    if (!is.na(Min_Spend$Affiliates))
      tmp = c(tmp, af - Min_Spend$Affiliates)
    if (!is.na(Max_Spend$Affiliates))
      tmp = c(tmp, Max_Spend$Affiliates - af)
  }
  
  if (!FixedChannel$FB & !(is.na(Min_Spend$FB) & is.na(Max_Spend$FB)))
  {
    fb   = sum(spend[t2[8]:t1[8]])
    if (!is.na(Min_Spend$FB))
      tmp = c(tmp, fb - Min_Spend$FB)
    if (!is.na(Max_Spend$FB))
      tmp = c(tmp, Max_Spend$FB - fb)
  }
  
  return(tmp)
}#InEquConstraint


#####################################################################################################################
########################################### Run_1 and Run_2 Optimization are different Ends ########################
#####################################################################################################################


Channel = rep(ChannelSpend2,  times = rep(ndays_LastYear, length(ChannelSpend2)))
#### For channel daily min/max bound; Use last year (10% Quantile)/2.0 and max*2.0 to be current year min/max
QuantilSmallTMP = unlist(tapply(Spend_LastYear[1:length(Channel)], Channel, FUN = function(x)sort(x)[length(x)*0.1]))
QuantilSmall = data.frame(Channel = names(QuantilSmallTMP), Min = QuantilSmallTMP)

QuantilLargeTMP = unlist(tapply(Spend_LastYear[1:length(Channel)], Channel, FUN = function(x)sort(x)[length(x)*1.0]))
QuantilLarge = data.frame(Channel = names(QuantilLargeTMP), Max = QuantilLargeTMP)


if(QuantilSmall["FB", ]$Min <=100)  QuantilSmall["FB", ]$Min = 1990  #2012 whole year FB 10% percentile
if(QuantilLarge["FB", ]$Max <=1000) QuantilLarge["FB", ]$Max = 36794 #2012 whole year FB max


LB = QuantilSmall$Min /2 
LB = LB[ChannelSpend2]
lb = rep(LB, each=ndays)

UB = QuantilLarge$Max*2
UB = UB[ChannelSpend2]
UB["SEMBrand"] = UB["SEMBrand"]*2 # SEMBrand loosen constraint
ub = rep(UB, each=ndays)



#### Set TV daily min/max bound 
if (!TV_ON)
{
        lb = c(lb, rep(0.5, tvDuration))
	ub = c(ub, rep(1.5, tvDuration))
} else
{
	lb = c(lb, rep(TVTotalImp/tvDuration/6.0, tvDuration))
	ub = c(ub, rep(TVTotalImp/tvDuration*4.0, tvDuration))
}

		

### Starts optimization.  Small "localtol" would slow down the program ####
ptm <- proc.time()
optimal = auglag(x0 = (lb+ub)/2, fn = Revenue, lower = lb, upper = ub, hin = InEquConstraint, heq = EqualConstraint, 
			            localsolver = c("LBFGS"), localtol = 1e-5)
#optimal = gosolnp(par = Spend_LastYear, fun = Revenue, eqfun = equalConstraint, eqB = c(0,0), LB = lb, UB = ub, control = list(n.restarts = 1, tol=1e-1))  			
proc.time() - ptm				


if(optimal$convergence > 0){
print("The optimal solution achieved.")
} else{
print("The optimization does not converge!!! The solution is not reliable.")
}


#-------------------------------------------------------------------------------------------
#---------------------------------  Optimization Output  -----------------------------------
#-------------------------------------------------------------------------------------------

#OptVsRealSpend = data.frame(OptimalSpend = optimal$par, ActualSpend = Spend_CurrentYear, DailyMin = lb, DailyMax = ub, Channel = Channel)
#write.csv(x = OptVsRealSpend, file = OutputPath)





# length(optimal$par): ndays*8 + tvDuration
tempchannel <- c("dis", "semB", "semC", "semP", "semO", "par", "aff", "soc", "dir", "TVImpression")  
tempcnt <- length(tempchannel)  #10
templength <- ndays*(tempcnt-2)



Revenue(optimal$par)
length(optimal$par)
print(dm)
print(dayOfMonth)
print(dim(matrix(Spend_CurrentYear[1:templength], nrow=ndays)))
print(dim(matrix(optimal$par[1:templength], nrow=ndays)))
print(tvWindow)
print(length(optimal$par[1:templength]))
print(length(optimal$par))

RealSpend <- data.frame(matrix(Spend_CurrentYear[1:templength], nrow=ndays),
                   dir=rep(dm, times=dayOfMonth)/30,
                   TVImpression=c(rep(0,tvWindow[1]-1), Spend_CurrentYear[(templength+1):length( Spend_CurrentYear)], rep(0,ndays-tvWindow[2])))
names(RealSpend)<- paste0("Real_", tempchannel)

OptSpend <- data.frame(matrix(optimal$par[1:templength], nrow=ndays),
                   dir=rep(dm, times=dayOfMonth)/30,
                   TVImpression=c(rep(0,tvWindow[1]-1), optimal$par[(templength+1):length(optimal$par)], rep(0,ndays-tvWindow[2])))
names(OptSpend)<- paste0("Opt_", tempchannel)

temp <-data.frame( OptTotalRevenue = Revenue(optimal$par),
                   RealTotalRevenue = data_CurrentYear$Revenue, 
                   FittedRevenue = Revenue2(Spend_CurrentYear),
                   OptSpend,
                   RealSpend)

#write.csv(temp,   paste0("Optimization_", Beg_Date, "_to_", End_Date, ".csv"), row.names=F)


OptTotalRevenue   <- -Revenue(optimal$par)
RealTotalRevenue  <- sum(data_CurrentYear$Revenue, na.rm=T)
TotalRevenueROI   <- OptTotalRevenue/RealTotalRevenue - 1
TotalRevenueROI   <- paste0(round(100*TotalRevenueROI, 2), "%")

print(paste0("Total Spend Last Year: $",  format(sum(Spend_LastYear[1: (ndays_LastYear*8)]),   big.mark=",", big.interval=3)))
print(paste0("Total Spend This Year: $",  format(sum(Spend_CurrentYear[1: (ndays*8)]),         big.mark=",", big.interval=3)))
print(paste0("Total Budget: $",           format(as.numeric(inJsonData$Spend),         big.mark=",", big.interval=3)))
print(paste0("Total Opt Spend: $",        format(sum(optimal$par[1: (ndays*8)]),         big.mark=",", big.interval=3)))

print(paste0("Total Revenue Last Year: $",  format(sum(data_LastYear$Revenue),   big.mark=",", big.interval=3)))
print(paste0("Total Revenue This Year: $",  format(sum(data_CurrentYear$Revenue),         big.mark=",", big.interval=3)))
print(paste0("Total Opt Revenue: $",  format(-Revenue(optimal$par),  big.mark=",", big.interval=3)))
print(paste0("Total Revenue ROI: ", TotalRevenueROI))




SR  <- tapply(optimal$par[1:templength], rep(1:(tempcnt-2), each=ndays), sum) 
#dir <- sum(dm)
#SR  <- c(SR, dir)
SR  <- SR[ChannelOutinOptChannel]
SR  <- c(sum(SR[1:4]), SR, as.numeric(inJsonData$Spend))
names(SR) <- paste0(SRChannel, 'SR')
SR <- round(SR, 0)

print(SR)

#force SR=fixed channel input 
#force SR = LB or min, whichever is larger,  if SR <= LB or SR <= min
#force SR = UB or max, whichever is smaller, if SR >= UB or SR >= max
#force total SR= total budget 
#force sum of SRs = total SR, spread difference across "buffer" channels

tmpChannel = c("SEM_Card", "SEM_PBook", "SEM_Other", "SEM_Brand", "Display", "FB", "Affiliates", "Partner")

#force SR=fixed channel input
tmpSpend =  c(NA, unlist(Min_Spend)[tmpChannel],NA)
tmp1 = which(c(0, unlist(FixedChannel)[tmpChannel], 0) >0)
SR[tmp1] =  tmpSpend[tmp1] 


#force SR = max(LB, Min), if SR <= max(LB, Min)
tmpSpend  =  c(-Inf, as.numeric(inJsonData[ paste0(ChannelOut, 'LB' )]), -Inf)
tmpSpend[which(is.na(tmpSpend))] = -Inf
tmpSpend2 =  c(-Inf, unlist(Min_Spend)[tmpChannel], -Inf)
tmpSpend2[which(is.na(tmpSpend2))] = -Inf
tmpSpend[which(tmpSpend < tmpSpend2)] = tmpSpend2[which(tmpSpend < tmpSpend2)] #replace LB with min if LB<min
tmp2 = which(SR[paste0(SRChannel,  'SR' )] <= tmpSpend +50) #if Min =500000 and SR=500001 will force SR=500000
SR[tmp2] = tmpSpend[tmp2]


#force SR = min(UB or Max),  if SR >= min(UB or Max)
tmpSpend  =  c( Inf, as.numeric(inJsonData[ paste0(ChannelOut, 'UB' )]),  Inf)
tmpSpend[which(is.na(tmpSpend))] =  Inf
tmpSpend2 =  c( Inf, unlist(Max_Spend)[tmpChannel],  Inf)
tmpSpend2[which(is.na(tmpSpend2))] = Inf
tmpSpend[which(tmpSpend > tmpSpend2)] = tmpSpend2[which(tmpSpend > tmpSpend2)] #replace UB with max if UB>max
tmp3 = which(SR[paste0(SRChannel,  'SR' )] >= tmpSpend -50)  #if Max=500000 and SR=499999 will force SR=500000
SR[tmp3] = tmpSpend[tmp3]




#if not all channels are fixed,  spread difference across channel spend mix %
variance = SR[length(SR)] - sum(SR[2: (length(SR)-1)])
if (length(unique(c(tmp1, tmp2, tmp3)))<length(SR)-2) {
tmpadjust = (1:length(SR))[-c(1, tmp1, tmp2, tmp3, length(SR))]
SR[tmpadjust] = SR[tmpadjust] + variance*SR[tmpadjust]/sum(SR[tmpadjust])
}


# After difference spread, SR may extend the bounds
# Re-Check SR with max(LB, Min) and min(UB or Max)
#force SR = max(LB, Min), if SR <= max(LB, Min)
tmpSpend  =  c(-Inf, as.numeric(inJsonData[ paste0(ChannelOut, 'LB' )]), -Inf)
tmpSpend[which(is.na(tmpSpend))] = -Inf
tmpSpend2 =  c(-Inf, unlist(Min_Spend)[tmpChannel], -Inf)
tmpSpend2[which(is.na(tmpSpend2))] = -Inf
tmpSpend[which(tmpSpend < tmpSpend2)] = tmpSpend2[which(tmpSpend < tmpSpend2)] #replace LB with min if LB<min
tmp2 = which(SR[paste0(SRChannel,  'SR' )] <= tmpSpend)
SR[tmp2] = tmpSpend[tmp2]
#force SR = min(UB or Max),  if SR >= min(UB or Max)
tmpSpend  =  c( Inf, as.numeric(inJsonData[ paste0(ChannelOut, 'UB' )]),  Inf)
tmpSpend[which(is.na(tmpSpend))] =  Inf
tmpSpend2 =  c( Inf, unlist(Max_Spend)[tmpChannel],  Inf)
tmpSpend2[which(is.na(tmpSpend2))] = Inf
tmpSpend[which(tmpSpend > tmpSpend2)] = tmpSpend2[which(tmpSpend > tmpSpend2)] #replace UB with max if UB>max
tmp3 = which(SR[paste0(SRChannel,  'SR' )] >= tmpSpend)
SR[tmp3] = tmpSpend[tmp3]


SR <- round(SR, 0)
SR[1]= sum(SR[2:5])  #semSR

print(SR)

return(list(SR=SR, OptTotalRevenue=OptTotalRevenue))


}#Run_1_Optimization

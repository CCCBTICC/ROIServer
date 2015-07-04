 

####################################################################################################################
# RROI: R Tool For Optimization Coefficent Table                                                              #
#                                                                                                                  #                            
# Objective: create coefficient table                                                                 #
#                                                                                                                  # 
##########################################################################################


RROI_coefficient_table <- function(Beg_Date= "2014-01-01")
{

#rm(list = ls())

Date         = "Date"
require.package<-function(pckg)
{
package.installed<-try(require(pckg, character.only =TRUE))
if (!package.installed) {
cat(paste("Installing", pckg,  "from CRAN\n", sep=" "))
install.packages(pckg,  repos = "http://cran.r-project.org")
require(pckg, character.only =TRUE)
}#if
}#require.package

#require.package("ROI")
require.package("Rsolnp")
require.package("gmm")
require.package("TSA")
require.package("mvtnorm")
require.package("MASS")
require.package("plyr")
require.package("shrink")
require.package("ridge")

require.package("Rsolnp")
require.package("caTools")
require.package("compiler")
require.package("nloptr") 
require.package("lubridate")
#require.package("sqldf")
 
#started turning any function we run into byte-code. To turn the JIT back off use enableJIT(0)
enableJIT(3)	



#find lag k of vector x, initial k values are mean(x) by default
lagpad <- function(x, k, pad=mean(x)) {
    c(rep(pad, k), x)[1 : length(x)] 
}


data = read.csv(file = Inputfile, as.is = T)
data$Date = as.Date(data$Date, "%m/%d/%Y")
data = data[data[,Date] < as.Date(Beg_Date),]
dim(data)

tmpchannel <- c("Revenue", "Display", "SEM", "SEMBrand", "SEMCard", "SEMPBook", "SEMOther",
                "Partners", "Affiliate", "FB", "DM", "TV", "TVImpression", 
                "Display_MTA", "SEM_MTA", "Partners_MTA", "Affiliates_MTA", "FB_MTA", "Direct_Mail_MTA",
                "Display_LTA", "SEM_LTA", "Partners_LTA", "Affiliates_LTA", "FB_LTA", "Direct_Mail_LTA")
data[, tmpchannel] <- apply(data[, tmpchannel], 2, function(x) ifelse(x <=0, 1, x))
data <- data[, c("Date", tmpchannel)]
data$year = year(data$Date)
data$month = month(data$Date)


############### function to write model result in csv file ##############
############### http://geokitchen.blogspot.com/2012/10/r-writing-regression-summary-to-table.html  ###########
## reg_model is the regression model, fname is the name of the csv file you want 
regr_tab <- function(reg_model, fname){
 
# coefficients in dataframe
regr_tab <- data.frame(summary(reg_model)$coefficients)
 
# grab the coefficients
colnames(regr_tab) <- colnames(summary(reg_model)$coefficients)
# get the p-vals 
regr_tab[ ,4] <- ifelse(regr_tab[ ,4] < .001, "< 0.001", 
                        ifelse(regr_tab[ ,4] < .01, "< 0.01", 
                               round(regr_tab[ ,4], 3)))
 
# format the table
summary = format(regr_tab, autoformat = 1)
 
# write it as a csv file 
write.csv(summary, fname)
}
############### function to write model result in csv file ##############


################################################ Daily Data Begins ####################################################
################################ Linear Model begins ######################################

# For each number in an array x, the average of the prior k numbers. 
LW_average <- function(x, k) {
k2 <- k %/% 2
n  <- length(x)
LW_average <- runmean(x=x, k=k, alg="fast", endrule="trim") #length=n- 2*k2, 1st corresp. to x[k+1]
LW_average <- c(rep(x[1], k), LW_average)[1:n]    # add k 1's 
return(LW_average)
}

 #runmean(1:10, k=3, alg="fast", endrule="trim")



Display_Last_Week         <- LW_average(data$Display,      7)
SEM_Last_Week             <- LW_average(data$SEM,          7)
SEMBrand_Last_Week        <- LW_average(data$SEMBrand,     7)	
SEMCard_Last_Week         <- LW_average(data$SEMCard,      7)	
SEMPBook_Last_Week        <- LW_average(data$SEMPBook,     7)		
SEMOther_Last_Week        <- LW_average(data$SEMOther,     7)		
Partners_Last_Week        <- LW_average(data$Partners,     7)		
Affiliate_Last_Week       <- LW_average(data$Affiliate,    7)		
FB_Last_Week              <- LW_average(data$FB,           7)		
TV_Last_Week              <- LW_average(data$TV,           7)		
TVImpression_Last_Week    <- LW_average(data$TVImpression, 7)	

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







lRevenue = log(data$Revenue); 


lOD = log(data$Display);
lOD_Q2 = lOD * Q2;
lOD_Q3 = lOD * Q3;
lOD_Q4 = lOD * Q4;
lODLW = log(Display_Last_Week);

lSEMB = log(data$SEMBrand);
lSEMB_Q2 = lSEMB * Q2;
lSEMB_Q3 = lSEMB * Q3;
lSEMB_Q4 = lSEMB * Q4;
lSEMBLW = log(SEMBrand_Last_Week);

lSEMC = log(data$SEMCard);
lSEMC_Q2 = lSEMC * Q2;
lSEMC_Q3 = lSEMC * Q3;
lSEMC_Q4 = lSEMC * Q4;
lSEMCLW = log(SEMCard_Last_Week);

lSEMP = log(data$SEMPBook);
lSEMP_Q2 = lSEMP * Q2;
lSEMP_Q3 = lSEMP * Q3;
lSEMP_Q4 = lSEMP * Q4;
lSEMPLW = log(SEMPBook_Last_Week);

lSEMO = log(data$SEMOther);
lSEMO_Q2 = lSEMO * Q2;
lSEMO_Q3 = lSEMO * Q3;
lSEMO_Q4 = lSEMO * Q4;
lSEMOLW = log(SEMOther_Last_Week);

lPA = log(data$Partners);
lPA_Q2 = lPA * Q2;
lPA_Q3 = lPA * Q3;
lPA_Q4 = lPA * Q4;
lPALW = log(Partners_Last_Week);

lAF = log(data$Affiliate);

lFB = log(data$FB);


lTV = log(data$TVImpression);
lTV_Q4 = lTV * Q4;
lTVLW = log(TVImpression_Last_Week);


TwoMonthPriorDM = rep(c(176684.51, 422078.09, 188463.48), times=c(1, 28, 31))
#176684.51: Jan 2011, 1 day 		
#422078.09: Feb 2011, 28 days 
#188463.48: Mar 2011, 31 days 
tmpDM = runmean(x = c(TwoMonthPriorDM, data$DM), k=30, alg="fast", endrule="trim")	#length=n+30		
length(tmpDM)
				
#### Didn't use dmLag15, since it's not significant ###			
DM1  = tmpDM[31:(length(tmpDM)-1) ]	
DM15 = tmpDM[16:(length(tmpDM)-16)]		
DM30 = tmpDM[1 :(length(tmpDM)-31)]

lDM1 = log(DM1);
lDM15 = log(DM15);
lDM30 = log(DM30);
#To create DM variables, firstly I put the same monthly spend on each day of the month 
#(you can take the average of the monthly spend and assign to each day)
#Assuming the current day is 0, then define
#DM1: average of daily DM spend from day -1 to day -30.
#DM15: average of daily DM spend from day -15 to day -45.
#DM30: average of daily DM spend from day -30 to day -60.


tmpdata <- 
data.frame(lRevenue, 
lOD	, lOD_Q2	, lOD_Q3	, lOD_Q4	, lODLW	, 
lSEMB	, lSEMB_Q2	, lSEMB_Q3	, lSEMB_Q4	, lSEMBLW	, 
lSEMC	, lSEMC_Q2	, lSEMC_Q3	, lSEMC_Q4	, lSEMCLW	, 
lSEMP	, lSEMP_Q2	, lSEMP_Q3	, lSEMP_Q4	, 
lSEMO	, lSEMO_Q2	, lSEMO_Q3	, lSEMO_Q4	, lSEMOLW	, 
lPA	, lPA_Q2	, lPA_Q3	, lPA_Q4	, lPALW	, 
lAF   , 
lTV	, lTV_Q4	, lTVLW	, 
lDM1	, lDM15	, lDM30	,
outlier11	, outlier12	, outlier13	, outlier14	, 
Feb	, Mar	, Apr	, May	, Jun	, Jul	, Aug	, Sep	, Oct	, Nov	, Dec	, 
t	, 
Weekday1	, Weekday2	, Weekday3	, Weekday4	, Weekday5	, Weekday6
)

#require.package("psych")
#describe(tmpdata)

#Linear Regression
#fmla <- "lRevenue~lOD+lOD_Q2+lOD_Q3+lOD_Q4+lOD_Y12+lOD_Y13+lODLW+lSEM+lSEM_Q2+lSEM_Q3+lSEM_Q4+lSEM_Y12+lSEM_Y13+lSEMLW+lPA+lPA_Q2+lPA_Q3+lPA_Q4+lPA_Y12+lPA_Y13+lPALW+lAF+lAF_Q2+lAF_Q3+lAF_Q4+lAF_Y12+lAF_Y13+lAFLW+lFB+lTV+lTV_Q4+lTV_Y13+lTVLW+lDM1+lDM15+lDM30+outlier11+outlier12+outlier13+Q2+Q3+Q4+Y2012+Y2013+Weekday1+Weekday2+Weekday3+Weekday4+Weekday5+Weekday6+Kodak"
fmla <- "lRevenue~ 
lOD	+ lOD_Q2	+ lOD_Q3	+ lOD_Q4	+ lODLW	+ 
lSEMB	+ lSEMB_Q2	+ lSEMB_Q3	+ lSEMB_Q4	+ lSEMBLW	+ 
lSEMC	+ lSEMC_Q2	+ lSEMC_Q3	+ lSEMC_Q4	+ lSEMCLW	+ 
lSEMP	+ lSEMP_Q2	+ lSEMP_Q3	+ lSEMP_Q4	+ 
lSEMO	+ lSEMO_Q2	+ lSEMO_Q3	+ lSEMO_Q4	+ lSEMOLW	+ 
lPA	+ lPA_Q2	+ lPA_Q3	+ lPA_Q4	+ lPALW	+ 
lAF   + 
lTV	+ lTV_Q4	+ lTVLW	+ 
lDM1	+ lDM30	+
outlier11	+ outlier12	+ outlier13	+ outlier14	+
Feb	+ Mar	+ Apr	+ May	+ Jun	+ Jul	+ Aug	+ Sep	+ Oct	+ Nov	+ Dec	+ 
t	+ 
Weekday1	+ Weekday2	+ Weekday3	+ Weekday4	+ Weekday5	+ Weekday6
"


if (as.Date(Beg_Date) <= as.Date("2014-11-01")) {
fmla <- "lRevenue~ 
lOD	+ lOD_Q2	+ lOD_Q3	+ lOD_Q4	+ lODLW	+ 
lSEMB	+ lSEMB_Q2	+ lSEMB_Q3	+ lSEMB_Q4	+ lSEMBLW	+ 
lSEMC	+ lSEMC_Q2	+ lSEMC_Q3	+ lSEMC_Q4	+ lSEMCLW	+ 
lSEMP	+ lSEMP_Q2	+ lSEMP_Q3	+ lSEMP_Q4	+ 
lSEMO	+ lSEMO_Q2	+ lSEMO_Q3	+ lSEMO_Q4	+ lSEMOLW	+ 
lPA	+ lPA_Q2	+ lPA_Q3	+ lPA_Q4	+ lPALW	+ 
lAF   + 
lTV	+ lTV_Q4	+ lTVLW	+ 
lDM1	+ lDM30	+
outlier11	+ outlier12	+ outlier13	+ 
Feb	+ Mar	+ Apr	+ May	+ Jun	+ Jul	+ Aug	+ Sep	+ Oct	+ Nov	+ Dec	+ 
t	+ 
Weekday1	+ Weekday2	+ Weekday3	+ Weekday4	+ Weekday5	+ Weekday6
"
}
	
if (as.Date(Beg_Date) <= as.Date("2013-11-01")) {
fmla <- "lRevenue~ 
lOD	+ lOD_Q2	+ lOD_Q3	+ lOD_Q4	+ lODLW	+ 
lSEMB	+ lSEMB_Q2	+ lSEMB_Q3	+ lSEMB_Q4	+ lSEMBLW	+ 
lSEMC	+ lSEMC_Q2	+ lSEMC_Q3	+ lSEMC_Q4	+ lSEMCLW	+ 
lSEMP	+ lSEMP_Q2	+ lSEMP_Q3	+ lSEMP_Q4	+ 
lSEMO	+ lSEMO_Q2	+ lSEMO_Q3	+ lSEMO_Q4	+ lSEMOLW	+ 
lPA	+ lPA_Q2	+ lPA_Q3	+ lPA_Q4	+ lPALW	+ 
lAF   + 
lTV	+ lTV_Q4	+ lTVLW	+ 
lDM1	+ lDM30	+
outlier11	+ outlier12	+  
Feb	+ Mar	+ Apr	+ May	+ Jun	+ Jul	+ Aug	+ Sep	+ Oct	+ Nov	+ Dec	+ 
t	+ 
Weekday1	+ Weekday2	+ Weekday3	+ Weekday4	+ Weekday5	+ Weekday6
"	
} # sd( outlier13)=0

#ResponseModel <-  lm(as.formula(fmla), data=data)
#summary(ResponseModel)
#regr_tab(ResponseModel, "delete00.csv")


# lm.ridge. need MASS package
#ResponseModel = lm.ridge(as.formula(fmla), data = regr_data, lambda = lambda)


#linearRidge, need ridge package
Ridge1 <- linearRidge(as.formula(fmla), data = tmpdata)
summary(Ridge1)
coef(Ridge1)
#pvals(Ridge1)
result = data.frame(Beg_Date, t(coef(Ridge1)))

names(result)[2]="Intercept"
if (is.null(result$outlier13)) result$outlier13=0.27
if (is.null(result$outlier14)) result$outlier14=0.27
result$lFB=0.01 ### Set FB coefficient = 0.01 for now, due to lack of enough data
tmpname = c(
"Beg_Date",    
"Intercept",
"lOD",         "lOD_Q2",      "lOD_Q3",    "lOD_Q4",      "lODLW",       
"lSEMB",       "lSEMB_Q2",    "lSEMB_Q3",   "lSEMB_Q4",    "lSEMBLW",     
"lSEMC",       "lSEMC_Q2",    "lSEMC_Q3",   "lSEMC_Q4",    "lSEMCLW",     
"lSEMP",       "lSEMP_Q2",    "lSEMP_Q3",   "lSEMP_Q4",    
"lSEMO",       "lSEMO_Q2",    "lSEMO_Q3",    "lSEMO_Q4",   "lSEMOLW",     
"lPA",         "lPA_Q2",      "lPA_Q3",      "lPA_Q4",     "lPALW",       
"lAF",    
"lFB", 
"lTV",         "lTV_Q4",      "lTVLW",      
"lDM1",        "lDM30",       
"outlier11",   "outlier12",   "outlier13",   "outlier14", 
"Feb",         "Mar",         "Apr",         "May",         "Jun",         "Jul",        "Aug",         "Sep",         "Oct",         "Nov",         "Dec",        
"t",           
"Weekday1",    "Weekday2",    "Weekday3",    "Weekday4",   "Weekday5",    "Weekday6"
)
result = result[tmpname]
#write.csv(summary(Ridge1)$summaries$summary13$coef, "delete11.csv")
# data2=data.frame(data, tmpdata); write.csv(data2, "delete11.csv", row.names=F)



return(result)
}#RROI_coefficient_table



wd         <- "C:/jimzh_work/Shutterfly_ROI"
setwd(wd)
Inputfile    = "RROI_input_data.csv"
Estfile      = "RROI_coefficient_table.csv"
Beg_Date     = "2013-01-01"
result0=NULL;

result=RROI_coefficient_table("2013-01-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-02-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-03-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-04-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-05-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-06-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-07-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-08-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-09-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-10-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-11-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2013-12-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2014-01-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2014-02-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2014-03-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2014-04-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2014-05-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2014-06-01");result0= rbind(result0, result);
result=RROI_coefficient_table("2014-07-01");result0= rbind(result0, result);
write.csv(result0, Estfile , row.names=F)



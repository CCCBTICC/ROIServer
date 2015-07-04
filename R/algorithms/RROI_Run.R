###########################################################################################################################				
#################################### Run_RROI:  Run Run_0, Run_1, Run_2 ###################################################
###########################################################################################################################				

#sudo R CMD BATCH --no-save --no-restore  '--args 1401313164_80.cfg' /var/www/deniX/webroot/ROI/algorithms/Run_RROI.R



###########################################################################################################################				
################################ Load JSON Data From JSON Input file ######################################################				
###########################################################################################################################	

jsonIOFolder  <- "C:/jimzh_work/Shutterfly_ROI/webROI/"
rCodeFolder   <- "C:/jimzh_work/Shutterfly_ROI"
rOutputFolder <- "C:/jimzh_work/Shutterfly_ROI/webROI/output"


jsonIOFolder  <- "/var/www/deniX/webroot/ROI/"
rCodeFolder   <- "/var/www/deniX/webroot/ROI/algorithms"
rOutputFolder <- "/var/www/deniX/webroot/ROI/output"




setwd(".")
curCallerFolder <- getwd()
setwd(rCodeFolder)

  
#folder and file pre-processing
  
require.package<-function(pckg)
{
package.installed<-try(require(pckg, character.only =TRUE))
if (!package.installed) {
cat(paste("Installing", pckg,  "from CRAN\n", sep=" "))
install.packages(pckg,  repos = "http://cran.r-project.org")
require(pckg, character.only =TRUE)
}#if
}#require.package

require.package("rjson")
require.package("lubridate")

library(rjson)
args=(commandArgs(TRUE))
if(length(args)==0){
    #supply default values
     inJsonFile <- "d2.cfg"
    #print("no args")
  } else {
   inJsonFile <- args[[1]]
}    
inJsonFileFullPath <- paste(jsonIOFolder,"input/",inJsonFile,sep="")
inJsonData <- fromJSON(paste(readLines(inJsonFileFullPath), collapse="")) 
outJsonFileFullPath <- paste(jsonIOFolder,"output/",inJsonFile,sep="")
inJsonData$Algorithm




###########################################################################################################################				
################################ Define Beg_Date, End_Date and Other Parameters ###########################################				
###########################################################################################################################	

Inputfile <- "RROI_input_data.csv"
Estfile   <- "RROI_coefficient_table.csv"
Fstfile   <- "RROI_elasticity_table.csv"

LTAMTA <- ifelse(toupper(inJsonData$lmTouch) == "LAST TOUCH", "_LTA", "_MTA")
nMon <- as.numeric(inJsonData$PlanMonths)

Date     <- "Date"
Beg_Date <- paste0(inJsonData$StartingTime, "-01")
End_Date <- as.character((seq(as.Date(Beg_Date), length=nMon+1, by="month") - 1)[nMon+1])

#if (!substr(inJsonData$EndingTime, 1, 4) %in% c("2012", "2016", "2020") & substr(inJsonData$EndingTime, 6, 7)=="02") End_Date  <- paste0(inJsonData$EndingTime,  "-28")
#if ( substr(inJsonData$EndingTime, 1, 4) %in% c("2012", "2016", "2020") & substr(inJsonData$EndingTime, 6, 7)=="02") End_Date  <- paste0(inJsonData$EndingTime,  "-29") #leap year
#if ( substr(inJsonData$EndingTime, 6, 7) %in% c("04", "06", "09", "11"))                                             End_Date  <- paste0(inJsonData$EndingTime,  "-30")
#if ( substr(inJsonData$EndingTime, 6, 7) %in% c("01", "03", "05", "07", "08", "10", "12"))                           End_Date  <- paste0(inJsonData$EndingTime,  "-31")

Beg_Date_LastYear <- paste0(year(as.Date(Beg_Date))-1, "-", month(as.Date(Beg_Date)), "-01")
End_Date_LastYear <- as.character((seq(as.Date(Beg_Date_LastYear ), length=nMon+1, by="month") - 1)[nMon+1])



DATE <- as.Date(seq(from=as.Date(Beg_Date),to=as.Date(End_Date),by='day'))
cmonth <- format(DATE,'%b')
MONTH <- factor(cmonth,levels=unique(cmonth),ordered=TRUE)  #Jan, Feb, Mar, ...
dayOfMonth =table(MONTH)	
ndays = sum(dayOfMonth)


DATE_LastYear <- as.Date(seq(from=as.Date(Beg_Date_LastYear),to=as.Date(End_Date_LastYear),by='day'))
cmonth_LastYear <- format(DATE_LastYear,'%b')
MONTH_LastYear <- factor(cmonth_LastYear,levels=unique(cmonth_LastYear),ordered=TRUE)  #Jan, Feb, Mar, ...
dayOfMonth_LastYear =table(MONTH_LastYear)	
ndays_LastYear = sum(dayOfMonth_LastYear)

####### SEMCard SEMPBook SEMOther SEMBrand  Display   FB   Affiliate Partners DM  ###########
ChannelSpend      <- c("SEMCard", "SEMPBook", "SEMOther", "SEMBrand", "Display",  "FB",  "Affiliate", "Partners")    
ChannelOut        <- c("semC", "semP", "semO", "semB", "dis",  "soc",  "aff", "par")   
ChannelOutTot     <- c("semC", "semP", "semO", "semB", "dis",  "soc",  "aff", "par", "tot")   
ChannelSpend2     <- c("Display", "SEMBrand", "SEMCard", "SEMPBook", "SEMOther",  "Partners", "Affiliate", "FB") 
OptChannel        <- c("dis", "semB", "semC", "semP", "semO",  "par",  "aff", "soc")
OptChannelinChannelOut <- match(OptChannel, ChannelOut) # 5 4 1 2 3 8 7 6 
ChannelOutinOptChannel <- match(ChannelOut, OptChannel) # 3 4 5 2 1 8 7 6 
SRChannel         <- c("sem", "semC", "semP", "semO", "semB", "dis",  "soc",  "aff", "par", "tot")  
PRChannel         <- c("sem", "dis",  "soc",  "aff", "par", "tot") 
ASChannel         <- SRChannel
ARChannel         <- PRChannel
#LB_pct            <- c(0.6,   0.6,    0.6,     0.99,     0.6,    0.6,   0.6,     0.99,   0.99)  
#UB_pct            <- c(1.4,   1.4,    1.4,     1.01,     1.4,    1.4,   1.4,     1.01,   1.01)
SF_cha            <- c("1.0", "1.0",  "1.0",   "1.0",    "1.0",    "1.0",  "1.0",   "1.0")

if (!exists("roDgt"))  roDgt <- 0

print(inJsonData[1:8])
a<-cbind(LB=as.numeric(inJsonData[ paste0(ChannelOut, 'LB' )]),as.numeric(inJsonData[ paste0(ChannelOut, 'Min' )]), as.numeric(inJsonData[ paste0(ChannelOut, 'Max' )]), as.numeric(inJsonData[ paste0(ChannelOut, 'UB' )]))
colnames(a) <- c('LB', 'Min', 'Max', 'UB')
print(a)
print(colSums(a))

###########################################################################################################################				
############################################## Run Run_0, Run_1, Run_2 ####################################################
###########################################################################################################################				

if (inJsonData$Algorithm == 0 || inJsonData$Algorithm==1) {
source("RROI_Run_0.R")
} else if (inJsonData$Algorithm==2) {
source("RROI_Run_1.R")
} else if (inJsonData$Algorithm==3) {
source("RROI_Run_2.R")
} else {
} # if inJsonData$Algorithm

  
setwd(curCallerFolder)
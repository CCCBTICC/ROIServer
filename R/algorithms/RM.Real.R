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

library(rjson)
args=(commandArgs(TRUE))
if(length(args)==0){
    #supply default values
     inJsonFile <- "1402455223_76.cfg"
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

Inputfile <- "ROI_Tool_Process_inputdata.csv"
Estfile   <- "ROI_Tool_Process_est.csv"

LTAMTA <- ifelse(toupper(inJsonData$lmTouch) == "LAST TOUCH", "_LTA", "_MTA")
nMon <- inJsonData$PlanMonths

Date     <- "Date"
Beg_Date <- paste0(inJsonData$StartingTime, "-01")
if (!substr(inJsonData$EndingTime, 1, 4) %in% c("2012", "2016", "2020") & substr(inJsonData$EndingTime, 6, 7)=="02") End_Date  <- paste0(inJsonData$EndingTime,  "-28")
if ( substr(inJsonData$EndingTime, 1, 4) %in% c("2012", "2016", "2020") & substr(inJsonData$EndingTime, 6, 7)=="02") End_Date  <- paste0(inJsonData$EndingTime,  "-29")
if ( substr(inJsonData$EndingTime, 6, 7) %in% c("04", "06", "09", "11"))                                             End_Date  <- paste0(inJsonData$EndingTime,  "-30")
if ( substr(inJsonData$EndingTime, 6, 7) %in% c("01", "03", "05", "07", "08", "10", "12"))                           End_Date  <- paste0(inJsonData$EndingTime,  "-31")

####### SEMCard SEMPBook SEMOther SEMBrand  Display   FB   Affiliate Partners DM  ###########
ChannelSpend      <- c("SEMCard", "SEMPBook", "SEMOther", "SEMBrand", "Display",  "FB",  "Affiliate", "Partners", "DM")     
ChannelOut        <- c("semC", "semP", "semO", "semB", "dis",  "soc",  "aff", "par", "dir")   
ChannelOutTot     <- c("semC", "semP", "semO", "semB", "dis",  "soc",  "aff", "par", "dir", "tot")   
OptChannel        <- c("dis", "semB", "semC", "semP", "semO",  "par",  "aff", "soc", "dir")
OptChannelinChannelOut <- match(OptChannel, ChannelOut) # 5 4 1 2 3 8 7 6 9
ChannelOutinOptChannel <- match(ChannelOut, OptChannel) # 3 4 5 2 1 8 7 6 9
SRChannel         <- c("sem", "semC", "semP", "semO", "semB", "dis",  "soc",  "aff", "par", "dir", "tot")  
PRChannel         <- c("sem", "dis",  "soc",  "aff", "par", "dir", "tot") 
ASChannel         <- SRChannel
ARChannel         <- PRChannel
LB_pct            <- c(0.6,   0.6,    0.6,     0.99,     0.6,    0.6,   0.6,     0.99,   0.99)  
UB_pct            <- c(1.4,   1.4,    1.4,     1.01,     1.4,    1.4,   1.4,     1.01,   1.01)
SF_cha            <- c("1.0", "1.0",  "1.0",   "1.0",    "1.0",    "1.0",  "1.0",   "1.0",  "1.0")

if (!exists("roDgt"))  roDgt <- 0

print(inJsonData[1:8])
a<-cbind(LB=inJsonData[ paste0(ChannelOut, 'LB' )],inJsonData[ paste0(ChannelOut, 'Min' )], inJsonData[ paste0(ChannelOut, 'Max' )], inJsonData[ paste0(ChannelOut, 'UB' )])
colnames(a) <- c('LB', 'Min', 'Max', 'UB')
print(a)

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
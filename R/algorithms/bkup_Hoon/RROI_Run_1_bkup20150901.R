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
      options(warn = -1)
      
      Fstfile#not in use
      #Inputfile     = "RROI_input_data.csv"
      #Fstfile       = "RROI_elasticity_table.csv"
      print("FC_1")
      
      
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
                                         ifelse(tolower(inJsonData$IncludeDataForThePeriod)=="yes", "YES", "NO")  ) 
      MaxDate_InputData = max(na.omit(as.Date(data$Date, "%m/%d/%Y"))) #Last Date data available 
      PlanFW_LookB <- ifelse(MaxDate_InputData < as.Date(Beg_Date), "PlanForward", "LookBack") 
      if(PlanFW_LookB=="PlanForward"){SkipMonths <- length(seq(from=as.Date(MaxDate_InputData), to=as.Date(Beg_Date), by='month')) - 1
                                     }else{SkipMonths <- 0}                                
      
      if(tolower(inJsonData$IncludeDataForThePeriod)=="yes"){data = data[data$Date <= as.Date(End_Date),]
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
      print("FC_2")
      
      
      
                                 
       
      #source("SubFunctions/forecast_fn_a.R")  #forecast_SARIMAX100100
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
        Channel=ChannelName[i]  #   Channel="SEM"   ; Attr="_LTA"  ; Spending=100000
        Attr=paste0("_", AttributionModel)
        Spending = ChannelSpendInput[i]*ChannelScalingFactor[i] 
        print("FC_3")
        
        data_proc = if(Attr=="_LTA"){
          if(Channel!="FB"){
            data_monthly_log[data_monthly_log$Date>="2012-04-01",]
          }else{
            data_monthly_log[data_monthly_log$Date>="2012-10-01",]
          }           
        }else{
          if(Channel!="FB"){
            data_monthly_log
          }else{            
            data_monthly_log[data_monthly_log$Date>="2012-10-01",] 
          }
        }
        # End: data_proc 
        
      if(paste0(ChannelName[i],"_", AttributionModel) %in% ls_RegUsingLags){
                      revPred_allchannel = c( revPred_allchannel,                        
                                              forecast_RegUsingLags(
                                                      Channel  #   Channel="SEM"   ; Attr="_LTA"  ; Spending=100000
                                                    , Attr
                                                    , Spending 
                                                    , SkipMonths  
                                                    , planMonths
                                                    , IncludeDataForThePeriod
                                              )
                                            )
                      }else{
                      
                                    print("fc_a_0")
                                    #source("global_fns/require_package.R")
                                    require.package("forecast")
                        
                                    ###############################
                                    ## time-series set preparation
                                    if(Attr=="_LTA"){
                                        if(Channel!="FB"){
                                                TS_d <- ts( data=data_proc[#data_proc[,Date]>="2012-04-01"
                                                                           ,-c(1:2)]
                                                            ,frequency = 12, start = c(2012, 4)
                                                )            
                                                a <- ts(TS_d[,paste0(Channel,Attr)],  frequency=12, start=c(2012, 4) )
                                                ChannelExp_ModelingSet <- as.matrix(data_proc[#data_proc[,Date]>="2012-04-01"
                                                                                                  ,Channel])            
                                         }else{
                                                TS_d <- ts( data=data_proc[#data_proc[,Date]<Dateseq[i]
                                                                           ,-c(1:2)]
                                                            ,frequency = 12, start = c(2012, 10)
                                                )            
                                                a <- ts(TS_d[,paste0(Channel,Attr)],  frequency=12, start=c(2012,10) )
                                                ChannelExp_ModelingSet <- as.matrix(data_proc[#data_proc[,Date]<Dateseq[i]
                                                                                                  ,Channel])                  
                                         }                                                   
                                    }else{
                                                if(Channel!="FB"){
                                                                  TS_d <- ts( data=data_proc[#data_proc[,Date]<Dateseq[i]
                                                                                             ,-c(1:2)]
                                                                              ,frequency = 12, start = c(2011, 4)
                                                                  )            
                                                                  a <- ts(TS_d[,paste0(Channel,Attr)],  frequency=12, start=c(2011,4) )
                                                                  ChannelExp_ModelingSet <- as.matrix(data_proc[#data_proc[,Date]<Dateseq[i]
                                                                                                                    ,Channel])                                 
                                                
                                                }else{
                                                                  TS_d <- ts( data=data_proc[#data_proc[,Date]<Dateseq[i]
                                                                                             ,-c(1:2)]
                                                                              ,frequency = 12, start = c(2012, 10)
                                                                  )            
                                                                  a <- ts(TS_d[,paste0(Channel,Attr)],  frequency=12, start=c(2012,10) )
                                                                  ChannelExp_ModelingSet <- as.matrix(data_proc[#data_proc[,Date]<Dateseq[i]
                                                                                                                    ,Channel])                 
                                                }
                                    }
                                    # End: time-series set preparation
                                    print("fc_a_1")
                                    fit <-  try(arima(a, order=c(1,0,0), seasonal=c(1,0,0) , xreg=ChannelExp_ModelingSet ))
                                    print("fc_a_2")          
                                  #1. Planforawd: 
                                  #       a. skipping month==0 : regular future projection
                                  #       b. skiiping month>0  : regular future projection, adding spendings for skipping period
                                  #2. lookback:
                                  #       a.IncludeDataForThePeriod==NO : regular future projection
                                  #       b.IncludeDataForThePeriod==YES: fitted value with different Spending (in the fitted set)
                                  if(SkipMonths==0){
                                                    print("fc_a_3")
                                                    if(IncludeDataForThePeriod=="NO"){ #For Planforward, it's always 'NO'. case 1.a & 2.a                                            
                                                    NegativeChannelRevCalculation<-function(x){
                                                              ChannelExp_ModelingSet<- data.frame("ChannelExp_ModelingSet"=log(x))
                                                              predSet <- forecast( fit, h=SkipMonths+planMonths
                                                                                   , xreg= ChannelExp_ModelingSet)$mean[(SkipMonths+1):(SkipMonths+planMonths)]
                                                              return(-sum(exp(predSet)))
                                                              }
                                                    print("fc_a_31")
                                                    #  NegativeChannelRevCalculation(rep(Spending/planMonths,planMonths))          
                                                    OptimResult <- constrOptim(
                                                                            theta=rep(Spending/planMonths,planMonths)  #initial value to optim. 
                                                                            , f=NegativeChannelRevCalculation
                                                                            #, grad=NULL
                                                                            , ui=rbind(rep(1,planMonths), rep(-1, planMonths))   # ui%*%theta   -ci  >=rep(0,2)
                                                                            , ci= c(Spending-0.1, -Spending-0.1)
                                                                            #, mu = 1e-04, control = list()
                                                                            ,method = "Nelder-Mead" ,
                                                                            ,outer.iterations = 100, outer.eps = 1e-01
                                                                            ,hessian = FALSE) 
                                                    print("fc_a_32")                        
                                                    Forecasted_Revenue<- round(-OptimResult$value, digits=0)
                                                    print("fc_a_4")
                                                    }else{ ## 2.b. Lookback, including Data for the Period.
                                                      print("fc_a_5")
                                                      #Revenue_set : contains revenue information (xx_LTA or xx_MTA)
                                                      Revenue_set <- data_proc[
                                                             (nrow(data_proc)-planMonths+1):nrow(data_proc)
                                                             , c(1 #1 is for Date
                                                                 ,grep(paste0(Channel, Attr), names(data_proc))
                                                                 #,which(names(data_proc)==Channel)
                                                                 #,grep(paste0(Channel, "_l"), names(data_proc))
                                                                 ) 
                                                            ]
                                                      phi_1 <- fit$coef[1]
                                                      phi_2 <- fit$coef[2]
                                                      mu    <- fit$coef[3]
                                                      Beta <- fit$coef[4]
                                                      
                                                      NegativeChannelRevCalculation<-function(E){
                                                                 #z is Spending_set
                                                                 z <- data_proc[
                                                                       #(nrow(data_proc)-planMonths+1):nrow(data_proc)
                                                                       , c(1 #1 is for Date
                                                                           #,grep(paste0(Channel, Attr), names(data_proc))
                                                                           ,which(names(data_proc)==Channel)
                                                                           ,grep(paste0(Channel, "_l"), names(data_proc))
                                                                           ) 
                                                                      ]                                                
                                                                
                                                                z[(nrow(z)-planMonths+1):nrow(z),Channel] <- log(E)        
                                                                for(q in (nrow(z)-planMonths+1):nrow(z)){
                                                                              z[q,paste0(Channel,"_l1")]<-z[(q-1),Channel]
                                                                              z[q,paste0(Channel,"_l12")]<-z[(q-12),Channel]
                                                                              z[q,paste0(Channel,"_l13")]<-z[(q-13),Channel]
                                                                     }
                                                                z <- z[(nrow(z)-planMonths+1):nrow(z),] #just take the forecasting part. 
                                                      
                                                                                                      
                                                                Fitted_Rev_with_Restated_Spending <- (
                                                                                                  Beta*z[2]+mu +
                                                                      phi_1*      (Revenue_set[3]-Beta*z[3]-mu)+
                                                                      phi_2*      (Revenue_set[4]-Beta*z[4]-mu)-
                                                                      phi_1*phi_2*(Revenue_set[5]-Beta*z[5]-mu))
                                                                      #Rev_set[3]:Rev_l1
                                                                      #Rev_set[4]:Rev_l12
                                                                      #Rev_set[5]:Rev_l13
                                                                      #z[2]:Spending
                                                                      #z[3]:Spending_l1, etc.
                                                                return(-sum(exp(Fitted_Rev_with_Restated_Spending)))
                                                                }
                                                      OptimResult <- constrOptim(
                                                                              theta=rep(Spending/planMonths,planMonths)  #initial value to optim. 
                                                                              , f=NegativeChannelRevCalculation
                                                                              #, grad=NULL
                                                                              , ui=rbind(rep(1,planMonths), rep(-1, planMonths))   # ui%*%theta   -ci  >=rep(0,2)
                                                                              , ci= c(Spending-0.1, -Spending-0.1)
                                                                              #, mu = 1e-04, control = list()
                                                                              ,method = "Nelder-Mead" ,
                                                                              ,outer.iterations = 100, outer.eps = 1e-01
                                                                              ,hessian = FALSE) 
                                                      Forecasted_Revenue<- round(-OptimResult$value, digits=0)
                                                      print("fc_a_6")
                                                    }
                                                    
                                       }else{ #skipMonths>0 ==> means, it's Planforward . case 1.b
                                          print("fc_a_7")
                                          #First, fill up expenses for skipping month, Using SARIMAX. 
                                          SpendingForSkippingMonths<-try(forecast(arima(ChannelExp_ModelingSet
                                                                                           , order=c(1,0,0)
                                                                                           , seasonal=c(1,0,0) )
                                                                                           , h=SkipMonths)$mean[1:SkipMonths])                                  #If SARIMAX fails, use regression with lags.
                                          if(class(SpendingForSkippingMonths)=="try-error"){
                                                      t_d<- na.omit(data_proc[,names(data_proc) %in% 
                                                                      c(Channel, paste0(Channel, "_l1"), paste0(Channel, "_l12"),paste0(Channel, "_l13"))])
                                                      names(t_d)<-c("X","X1", "X12","X13")
                                                      t_fit <- lm(X~X1+X12+X13, data=t_d) 
                                                      data_temp<-t_d
                                                      for(q in 1:SkipMonths){
                                                              #newdata<-data_temp[(nrow(data_proc)+q),]
                                                              data_temp<- rbind(data_temp, data_temp[nrow(data_temp),])
                                                              data_temp[nrow(data_temp),"X1"]<-data_temp[(nrow(data_temp)-1),"X"]
                                                              data_temp[nrow(data_temp),"X12"]<-data_temp[(nrow(data_temp)-12),"X"]
                                                              data_temp[nrow(data_temp),"X13"]<-data_temp[(nrow(data_temp)-13),"X"]
                                                              data_temp[nrow(data_temp),"X"] <- predict.lm(t_fit,newdata=data_temp[nrow(data_temp),-1]) 
                                                      }
                                                      SpendingForSkippingMonths <- data_temp[(nrow(t_d)+1):nrow(data_temp),"X"] #already log transformed.
                                          }
                                            
                                            
                                          NegativeChannelRevCalculation<-function(x){
                                                    ChannelExp_ModelingSet<- data.frame("ChannelExp_ModelingSet"=c(SpendingForSkippingMonths,log(x)))
                                                    predSet <- forecast( fit, h=SkipMonths+planMonths
                                                                         , xreg= ChannelExp_ModelingSet)$mean[(SkipMonths+1):(SkipMonths+planMonths)]
                                                    return(-sum(exp(predSet)))
                                                    }
                                          #NegativeChannelRevCalculation(x=rep(Spending/planMonths,planMonths))          
                                          OptimResult <- constrOptim(
                                                                  theta=rep(Spending/planMonths,planMonths)  #initial value to optim. 
                                                                  , f=NegativeChannelRevCalculation
                                                                  #, grad=NULL
                                                                  , ui=rbind(rep(1,planMonths), rep(-1, planMonths))   # ui%*%theta   -ci  >=rep(0,2)
                                                                  , ci= c(Spending-0.1, -Spending-0.1)
                                                                  #, mu = 1e-04, control = list()
                                                                  ,method = "Nelder-Mead" ,
                                                                  ,outer.iterations = 100, outer.eps = 1e-01
                                                                  ,hessian = FALSE) 
                                          Forecasted_Revenue<- round(-OptimResult$value, digits=0)
                                          print("fc_a_8")
                                      }   #End: skipMonths>0
                                                    
                      revPred_allchannel = c( revPred_allchannel,
                                              Forecasted_Revenue                        
                                              #forecast_SARIMAX100100(
                                              #      data_proc
                                              #      , Channel #   Channel="SEM"   ; Attr="_LTA"  ; Spending=100000
                                              #      , Attr
                                              #      , Spending 
                                              #      , SkipMonths  
                                              #      , planMonths
                                              #      , IncludeDataForThePeriod
                                              #)
                                            )
                            
                      }
      
      } #for (i in 1: length(ChannelName)) 
      
      
      PR <- revPred_allchannel
      PR <- c(PR, sum(PR))
      names(PR) <- paste0(PRChannel, "PR")
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


  
  # 1. First run
  #    a.LB : actual vs optimize revenue  
  #    b.PF : 0
  # 2.Re-Run                                    
  #    a.LB : actual vs optimize revenue  
  #    b.PF : previous opt. vs new opt. 
      ## Read spending input
      data      = read.csv(file =  InputSpendingPath, as.is = T)
      data$Date = as.Date(data$Date, "%m/%d/%Y")
      data[,-which(names(data)=="Date")] <- apply(data[,-which(names(data)=="Date")], 2, function(x) as.numeric(x))
      data_monthly <- d_monthly_aggregation(data)   
  if(PlanFW_LookB=="LookBack"){
  Actual_TTL_Rev_for_the_period <- sum(data_monthly[as.character(data_monthly$Month)>=substr(as.character(Beg_Date),1,7) &
                                                    as.character(data_monthly$Month)<=substr(as.character(End_Date),1,7)
                                                    ,]$Revenue)
                                 
  PercentageChangeInTotalRev<-  round( (OptTotalRevenue-Actual_TTL_Rev_for_the_period) / Actual_TTL_Rev_for_the_period *100, roDgt) 
  } else{ # if plan forward. 
  PercentageChangeInTotalRev <- 0
  }
  
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
  
  cat(paste0('"IncludeDataForThePeriod":',      '"', inJsonData$IncludeDataForThePeriod, '",\n'))

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
  cat(paste0('"dirSpendM4":',      '"', inJsonData$dirSpendM4,      '",\n'))
  cat(paste0('"dirSpendM5":',      '"', inJsonData$dirSpendM5,      '",\n'))
  cat(paste0('"dirSpendM6":',      '"', inJsonData$dirSpendM6,      '",\n'))  

  
  cat(paste0('"tvBeginDate":"',   inJsonData$tvBeginDate,     '",\n'))
  cat(paste0('"tvEndDate":"',     inJsonData$tvEndDate,       '",\n'))
  cat(paste0('"tvImpressions":"', inJsonData$tvImpressions,   '",\n'))
  cat(paste0('"tvSpend":"',       inJsonData$tvSpend,         '",\n'))


  cat(paste0('"', paste0(SRChannel,  'SR' ),  '": "', round(SR, roDgt), '",\n')) # Spending recommneded
  cat(paste0('"OptTotalRevenue": ', '"', round(OptTotalRevenue, roDgt), '",\n'))## added for optimizedTotalRevenue  for Run_1  
  cat(paste0('"', paste0(PRChannel,  'PR' ),  '": "', round(PR, roDgt), '",\n')) #Projected Revenue

  cat(paste0('"run1RevRange":',    '"', run1RevRange,  '",\n'))
  # After Run1, run1ProjROI & run2ProjROI both has the value of run1ProjROI.
  cat(paste0('"run1ProjROI":',     '"', run1ProjROI,   '",\n'))
  cat(paste0('"run1ROIRange":',    '"', run1ROIRange,  '",\n'))
  
  
  cat(paste0('"', paste0(ChannelOut,    'SlideLeft'         ),  '": "', inJsonData[ paste0(ChannelOut, 'LB' )], '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'Slide'             ),  '": "', round(SR[2:(length(SR)-1)], roDgt), '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideRight'        ),  '": "', inJsonData[ paste0(ChannelOut, 'UB' )], '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideDivMin'       ),  '": "', inJsonData[ paste0(ChannelOut, 'LB' )], '",\n'))
  cat(paste0('"', paste0(ChannelOut,    'SlideDivMax'       ),  '": "', inJsonData[ paste0(ChannelOut, 'UB' )], '",\n'))
  cat(paste0('"', paste0(ASChannel,     'AS'                ),  '": "', round(SR, roDgt), '",\n'))
  
  cat(paste0('"OptTotalRevenue_Run2": ', '"', round(OptTotalRevenue, roDgt), '",\n'))## for Run_1, it's the same as OptTotalRevenue
  cat(paste0('"PercentageChangeInTotalRev": ', '"', PercentageChangeInTotalRev, '",\n'))  
  cat(paste0('"', paste0(ARChannel,     'AR'                ),  '": "', round(PR, roDgt), '",\n'))

  # After Run1, run1ProjROI & run2ProjROI both has the value of run1ProjROI.
  cat(paste0('"run2ProjROI":',    '"', run2ProjROI,  '"\n'))  # no comma before \n
  
  cat(paste0("}","\n"))

  
  #end outputting json file
  sink()


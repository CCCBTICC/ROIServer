forecast_RegUsingLags   <- function(  
                                Channel  #   Channel="SEM"   ; Attr="_LTA"
                              , Attr
                              , Spending                              
                              , SkipMonths  #j=
                              , planMonths  #k=
                              , IncludeDataForThePeriod="NO"
                            ){
                            
formuladf <- data.frame("Channel_Attr"=c("Affiliates_LTA", "Partners_LTA","Partners_MTA"),
                        "formula"=c("Affiliates_LTA ~ Affiliates",
                                    "Partners_LTA ~ Partners_LTA_l1 + Partners_LTA_l12 + Partners_LTA_l13 + Partners",
                                    "Partners_MTA ~ Partners_MTA_l1 + Partners_MTA_l12 + Partners_MTA_l13 + Partners")                        )
#formula="SEM_LTA ~ SEM_LTA_l1 + SEM_LTA_l12 + SEM_LTA_l13 + SEM" 
#formula="SEM_MTA ~ SEM_MTA_l1 + SEM_MTA_l12 + SEM_MTA_l13 + SEM" 
#formula="Display_LTA ~ Display_LTA_l1 + Display_LTA_l12 + Display_LTA_l13 + Display" 
#formula="Display_MTA ~ Display_MTA_l1 + Display_MTA_l12 + Display_MTA_l13 + Display" 
#formula="Partners_LTA ~ Partners_LTA_l1 + Partners_LTA_l12 + Partners_LTA_l13 + Partners" 
#formula="Partners_MTA ~ Partners_MTA_l1 + Partners_MTA_l12 + Partners_MTA_l13 + Partners" 
#formula="Affiliates_LTA ~ Affiliates" 
#formula="Affiliates_MTA ~ Affiliates" 
#formula="FB_LTA ~ FB_LTA_l1 + FB_LTA_l12 + FB_LTA_l13 + FB" 
#formula="FB_MTA ~ FB_MTA_l1 + FB_MTA_l12 + FB_MTA_l13 + FB"  

formula<- as.character(formuladf[formuladf$Channel_Attr==paste0(Channel,Attr),"formula"])                           
                              
                             
                              #data_proc = if(Attr=="_LTA"){
                              #data_monthly_log[data_monthly_log$Date>="2012-04-01",
                              #                #c("Month","Date",strsplit(formula," ")[[1]][!(strsplit(formula," ")[[1]] %in% c("~", "+"))])
                              #                ]
                              #}else{
                              #      if(Channel!="FB"){
                              #          data_monthly_log[#
                              #                           #c("Month","Date",strsplit(formula," ")[[1]][!(strsplit(formula," ")[[1]] %in% c("~", "+"))])
                              #                          ]
                              #      }else{            
                              #          data_monthly_log[data_monthly_log$Date>="2012-10-01", 
                              #                           #c("Month","Date",strsplit(formula," ")[[1]][!(strsplit(formula," ")[[1]] %in% c("~", "+"))])
                              #                          ] 
                              #      }
                              #}
                              # End: data_proc              
                          
            data_fit <-na.omit(data_proc)   
            if(Channel=="FB"){data_fit[data_fit==-Inf]<-1}
            fit <- lm(formula, data=data_fit)


                                        
                            #1. Planforawd: 
                            #       a. skipping month==0 : regular future projection
                            #       b. skiiping month>0  : regular future projection, adding spendings for skipping period
                            #2. lookback:
                            #       a.IncludeDataForThePeriod==NO : regular future projection
                            #       b.IncludeDataForThePeriod==YES: fitted value with different Spending (in the fitted set)
                            if(SkipMonths==0){
                                              if(IncludeDataForThePeriod=="NO"){ 
                                              #################################################
                                              #1.a & 2.a. For Planforward, it's always 'NO'.
                                              #E :ChannelExp_PredSet
                                              NegativeChannelRevCalculation<-function(E){
                                                       #z includes Lags for revenue, here. 
                                                       z <- data_proc[
                                                             #(nrow(data_proc)-planMonths+1):nrow(data_proc)
                                                             , c(#1, #1 is for Date
                                                                 grep(paste0(Channel, Attr), names(data_proc))
                                                                 ,which(names(data_proc)==Channel)
                                                                 #,grep(paste0(Channel, "_l"), names(data_proc))
                                                                 ) 
                                                            ]                                                
                                                      
                                                      ## add a dummy rows for forecast, as many rows as plan month
                                                      temp <- z[1:(planMonths+1),]+1
                                                      z<- rbind(z,temp[-1,])
                                                      rm("temp")
                                                      
                                                                    ct<-1
                                                      for(q in (nrow(z)-planMonths+1):nrow(z)){                                                                        
                                                                    z[q,Channel] <-max(log(E[ct]),0);ct<-ct+1
                                                                    z[q,paste0(Channel,Attr,"_l1")]<-z[(q-1),paste0(Channel, Attr)]
                                                                    z[q,paste0(Channel,Attr,"_l12")]<-z[(q-12),paste0(Channel, Attr)]
                                                                    z[q,paste0(Channel,Attr,"_l13")]<-z[(q-13),paste0(Channel, Attr)]
                                                                    z[q,paste0(Channel,Attr)]<- predict(fit,newdata=z[q,-1])
                                                           }
                                                      
                                            
                                                                                            
                                                      predSet <- z[(nrow(z)-planMonths+1):nrow(z),paste0(Channel,Attr)] 
                                                      return(-sum(exp(predSet)))
                                                      }
                                              ui<-rbind(rep(1,planMonths), rep(-1, planMonths))
                                              ci<-c(Spending-0.1, -Spending-0.1)
                                              if(planMonths>1){ # make monthly spending at least, 20% of even distribution. 
                                                                #This is to avoid an extreme budget allocation.  
                                                                ui<- rbind(ui, diag(x = 1, nrow=planMonths, ncol=planMonths))
                                                                ci<-c(ci, rep((Spending/planMonths)*0.2, planMonths))
                                              }                                                               
                                              OptimResult <- constrOptim(
                                                                      theta=rep(Spending/planMonths,planMonths)  #initial value to optim. 
                                                                      , f=NegativeChannelRevCalculation
                                                                      #, grad=NULL
                                                                      , ui=ui   # ui%*%theta   -ci  >=rep(0,2)
                                                                      , ci=ci
                                                                      #, mu = 1e-04, control = list()
                                                                      ,method = "Nelder-Mead" ,
                                                                      ,outer.iterations = 100, outer.eps = 1e-01
                                                                      ,hessian = FALSE) 
                                              Forecasted_Revenue<- round(-OptimResult$value, digits=0)
                                              # End: 1.a & 2.a. 
                                              #################################################                                                                    
                                              }else{ 
                                                ################################################
                                                ## 2.b. Lookback, including Data for the Period.
                                                NegativeChannelRevCalculation<-function(E){
                                                         #z includes Lags for revenue, here. 
                                                         z <- data_proc[
                                                               #(nrow(data_proc)-planMonths+1):nrow(data_proc)
                                                               , c(#1, #1 is for Date
                                                                   grep(paste0(Channel, Attr), names(data_proc))
                                                                   ,which(names(data_proc)==Channel)
                                                                   #,grep(paste0(Channel, "_l"), names(data_proc))
                                                                   ) 
                                                              ]                                                
                                                        
                                                        ## Do not need this step, b/c restate revenue for the period(actual).  
                                                        #temp <- z[1:(planMonths+1),]+1
                                                        #z<- rbind(z,temp[-1,])
                                                        #rm("temp")
                                                        
                                                                      ct<-1
                                                        for(q in (nrow(z)-planMonths+1):nrow(z)){                                                                        
                                                                      z[q,Channel] <-max(log(E[ct]),0);ct<-ct+1
                                                                      z[q,paste0(Channel,Attr,"_l1")]<-z[(q-1),paste0(Channel, Attr)]
                                                                      z[q,paste0(Channel,Attr,"_l12")]<-z[(q-12),paste0(Channel, Attr)]
                                                                      z[q,paste0(Channel,Attr,"_l13")]<-z[(q-13),paste0(Channel, Attr)]
                                                                      z[q,paste0(Channel,Attr)]<- predict(fit,newdata=z[q,-1])
                                                             }
                                                        
                                              
                                                                                              
                                                        predSet <- z[(nrow(z)-planMonths+1):nrow(z),paste0(Channel,Attr)] 
                                                        return(-sum(exp(predSet)))
                                                        }        
                                                ui<-rbind(rep(1,planMonths), rep(-1, planMonths))
                                                ci<-c(Spending-0.1, -Spending-0.1)
                                                if(planMonths>1){ # make monthly spending at least, 20% of even distribution. 
                                                                  #This is to avoid an extreme budget allocation.  
                                                                  ui<- rbind(ui, diag(x = 1, nrow=planMonths, ncol=planMonths))
                                                                  ci<-c(ci, rep((Spending/planMonths)*0.2, planMonths))
                                                } 
                                                OptimResult <- constrOptim(
                                                                        theta=rep(Spending/planMonths,planMonths)  #initial value to optim. 
                                                                        , f=NegativeChannelRevCalculation
                                                                        #, grad=NULL
                                                                        , ui=ui   # ui%*%theta   -ci  >=rep(0,2)
                                                                        , ci=ci
                                                                        #, mu = 1e-04, control = list()
                                                                        ,method = "Nelder-Mead" ,
                                                                        ,outer.iterations = 100, outer.eps = 1e-01
                                                                        ,hessian = FALSE) 
                                                Forecasted_Revenue<- round(-OptimResult$value, digits=0)



                                                ## End: 2.b. 
                                                ################################################  
                                                }
                                 }else{ 
                                              ############################################
                                              # Case 1.b. skipMonths>0 ==> means, it's Planforward always.
                                              #E :ChannelExp_PredSet
                                              NegativeChannelRevCalculation<-function(E){
                                                       #z includes Lags for revenue, here. 
                                                       z <- data_proc[

                                                             , c(#1, #1 is for Date
                                                                 grep(paste0(Channel, Attr), names(data_proc))
                                                                 ,which(names(data_proc)==Channel)
                                                                 #,grep(paste0(Channel, "_l"), names(data_proc))
                                                                 ) 
                                                            ]                                                
                                                      
                                                      ## add a dummy rows for forecast, as many rows as plan month
                                                      temp <- z[1:(SkipMonths+planMonths+1),]+1
                                                      z<- rbind(z,temp[-1,])
                                                      rm("temp")

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
                                                            SpendingForSkippingMonths <- data_temp[(nrow(t_d)+1):nrow(data_temp),"X"]

                                                                                                            
                                                            ct<-1
                                                            for(q in (nrow(z)-SkipMonths-planMonths+1):nrow(z)){                                                                                
                                                                          
                                                                          z[q,Channel] <-ifelse(ct<=SkipMonths,
                                                                                               SpendingForSkippingMonths[ct],
                                                                                               max(log(E[ct-SkipMonths]),0))
                                                                          ct<-ct+1
                                                                          z[q,paste0(Channel,Attr,"_l1")]<-z[(q-1),paste0(Channel, Attr)]
                                                                          z[q,paste0(Channel,Attr,"_l12")]<-z[(q-12),paste0(Channel, Attr)]
                                                                          z[q,paste0(Channel,Attr,"_l13")]<-z[(q-13),paste0(Channel, Attr)]
                                                                          z[q,paste0(Channel,Attr)]<- predict(fit,newdata=z[q,-1])
                                                                 }

                                            
                                                                                            
                                                      predSet <- z[(nrow(z)-planMonths+1):nrow(z),paste0(Channel,Attr)]  
                                                      return(-sum(exp(predSet)))
                                                      }        
                                              ui<-rbind(rep(1,planMonths), rep(-1, planMonths))
                                              ci<-c(Spending-0.1, -Spending-0.1)
                                              if(planMonths>1){ # make monthly spending at least, 20% of even distribution. 
                                                                #This is to avoid an extreme budget allocation.  
                                                                ui<- rbind(ui, diag(x = 1, nrow=planMonths, ncol=planMonths))
                                                                ci<-c(ci, rep((Spending/planMonths)*0.2, planMonths))
                                              } 
                                              OptimResult <- constrOptim(
                                                                      theta=rep(Spending/planMonths,planMonths)  #initial value to optim. 
                                                                      , f=NegativeChannelRevCalculation
                                                                      #, grad=NULL
                                                                      , ui=ui   # ui%*%theta   -ci  >=rep(0,2)
                                                                      , ci=ci
                                                                      #, mu = 1e-04, control = list()
                                                                      ,method = "Nelder-Mead" ,
                                                                      ,outer.iterations = 100, outer.eps = 1e-01
                                                                      ,hessian = FALSE) 
                                              Forecasted_Revenue<- round(-OptimResult$value, digits=0)                
                                              }
                                              # End: Case 1.b.
                                              ############################################
                                
    return(Forecasted_Revenue)     
                                
}                            
 
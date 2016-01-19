d_monthly_aggregation <- function(d){

      ###############################################################
      ## It looks like DM expense is Monthly TTL, not daily expense #
      ###############################################################
      #Monthls <- sort(unique(d_Rev_Cost$Date))
      #for(i in 1:length(Monthls)){
      #print(Monthls[i])
      #print(unique(subset(d_Rev_Cost, d_Rev_Cost$Date==Monthls[i])$DM))
      #}
      d$Month <-substr(as.character(d$Date), 1,7)
      d_monthly <- data.frame(
      "Month"=sort(unique(d$Month)),
      "Revenue"=aggregate(d$Revenue, by=list(Category=d$Month), FUN=sum)$x ,
      "SEM"=aggregate(d$SEM, by=list(Category=d$Month), FUN=sum)$x ,

      "SEMCard"=aggregate(d$SEMCard, by=list(Category=d$Month), FUN=sum)$x ,
      "SEMPBook"=aggregate(d$SEMPBook, by=list(Category=d$Month), FUN=sum)$x ,
      "SEMOther"=aggregate(d$SEMOther, by=list(Category=d$Month), FUN=sum)$x ,
      "SEMBrand"=aggregate(d$SEMBrand, by=list(Category=d$Month), FUN=sum)$x ,                        
                  
      "Display"=aggregate(d$Display, by=list(Category=d$Month), FUN=sum)$x,
      "FB"=aggregate(d$FB, by=list(Category=d$Month), FUN=sum)$x ,
      "Affiliate"=aggregate(d$Affiliate, by=list(Category=d$Month), FUN=sum)$x ,
      "Partners"=aggregate(d$Partners, by=list(Category=d$Month), FUN=sum)$x ,
      "TV"=aggregate(d$TV, by=list(Category=d$Month), FUN=sum)$x  ,
      "TVImpression"=aggregate(d$TVImpression, by=list(Category=d$Month), FUN=sum)$x   ,
      "DM"=aggregate(d$DM, by=list(Category=d$Month), FUN=unique)$x,
      
      "SEM_LTA"=aggregate(d$SEM_LTA, by=list(Category=d$Month), FUN=sum)$x ,
      "Display_LTA"=aggregate(d$Display_LTA, by=list(Category=d$Month), FUN=sum)$x,
      "FB_LTA"=aggregate(d$FB_LTA, by=list(Category=d$Month), FUN=sum)$x ,
      "Affiliates_LTA"=aggregate(d$Affiliates_LTA, by=list(Category=d$Month), FUN=sum)$x ,
      "Partners_LTA"=aggregate(d$Partners_LTA, by=list(Category=d$Month), FUN=sum)$x ,
      
      "SEM_MTA"=aggregate(d$SEM_MTA, by=list(Category=d$Month), FUN=sum)$x ,
      "Display_MTA"=aggregate(d$Display_MTA, by=list(Category=d$Month), FUN=sum)$x,
      "FB_MTA"=aggregate(d$FB_MTA, by=list(Category=d$Month), FUN=sum)$x ,
      "Affiliates_MTA"=aggregate(d$Affiliates_MTA, by=list(Category=d$Month), FUN=sum)$x ,
      "Partners_MTA"=aggregate(d$Partners_MTA, by=list(Category=d$Month), FUN=sum)$x 
      )
      d_monthly$BusinessAsUsual_LTA <- d_monthly$Revenue - d_monthly$SEM_LTA - d_monthly$Display_LTA  - d_monthly$FB_LTA  - d_monthly$Affiliates_LTA  - d_monthly$Partners_LTA
      d_monthly$BusinessAsUsual_MTA <- d_monthly$Revenue - d_monthly$SEM_MTA - d_monthly$Display_MTA  - d_monthly$FB_MTA  - d_monthly$Affiliates_MTA  - d_monthly$Partners_MTA
      
      
      return(d_monthly)


}          
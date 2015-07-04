options(gsubfn.engine = "R")
options(sqldf.driver = "SQLite")


#install.packages("tcltk", repos= "http://cran.us.r-project.org")
#install.packages("gsubfn", repos= "http://cran.us.r-project.org")
install.packages("sqldf", repos= "http://cran.us.r-project.org")


library(sqldf)   ## SQL

a<-data.frame(x=1:10)
sqldf('select sum(x) from a')

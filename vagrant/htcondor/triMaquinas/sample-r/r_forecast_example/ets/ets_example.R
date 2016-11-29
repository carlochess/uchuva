#!/usr/bin/env Rscript
performPrediction <- function(){
	fit <- auto.arima(USAccDeaths)
	print(fit)
	pdf("USAccDeaths_ets.pdf")
	plot(forecast(fit))
	dev.off() 
}

library('forecast')
performPrediction()

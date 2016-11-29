#!/usr/bin/env Rscript
performPrediction <- function(){
	fit <- auto.arima(WWWusage)

	pdf("WWWusage_arima.pdf")
	plot(forecast(fit,h=20))
	dev.off() 
}

library('forecast')
performPrediction()

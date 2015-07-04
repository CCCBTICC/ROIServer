var mongoose = require('mongoose');

// Create the ScenarioSchema
var ScenarioSchema = new mongoose.Schema({
	UserName: {
		type: String
	},
	Brand: {
		type: String
	},
	Spend: {
		type: String
	},
	StartingTime: {
		type: String
	},
	PlanMonths: {
		type: String
	},
	EndingTime: {
		type: String
	},
	lmTouch: {
		type: String
	},
	Algorithm: {
		type: String
	},
	AlgStartingTime: {
		type: String
	},
	AlgEndingTime: {
		type: String
	},
	AlgDuration: {
		type: String
	},
	semCLB: {
		type: String
	},
	semPLB: {
		type: String
	},
	semOLB: {
		type: String
	},
	disLB: {
		type: String
	},
	socLB: {
		type: String
	},
	affLB: {
		type: String
	},
	parLB: {
		type: String
	},
	SpendLB: {
		type: String
	},
	semCMin: {
		type: String
	},
	semPMin: {
		type: String
	},
	semOMin: {
		type: String
	},
	semBMin: {
		type: String
	},
	disMin: {
		type: String
	},
	socMin: {
		type: String
	},
	affMin: {
		type: String
	},
	parMin: {
		type: String
	},
	semCMax: {
		type: String
	},
	semPMax: {
		type: String
	},
	semOMax: {
		type: String
	},
	semBMax: {
		type: String
	},
	disMax: {
		type: String
	},
	socMax: {
		type: String
	},
	affMax: {
		type: String
	},
	parMax: {
		type: String
	},
	semCUB: {
		type: String
	},
	semPUB: {
		type: String
	},
	semOUB: {
		type: String
	},
	semBUB: {
		type: String
	},
	disUB: {
		type: String
	},
	socUB: {
		type: String
	},
	affUB: {
		type: String
	},
	parUB: {
		type: String
	},
	SpendUB: {
		type: String
	},
	semCSF: {
		type: String
	},
	semPSF: {
		type: String
	},
	semOSF: {
		type: String
	},
	semBSF: {
		type: String
	},
	disSF: {
		type: String
	},
	socSF: {
		type: String
	},
	affSF: {
		type: String
	},
	parSF: {
		type: String
	},
	dirSpendM1: {
		type: String
	},
	dirSpendM2: {
		type: String
	},
	dirSpendM3: {
		type: String
	},
	tvBeginDate: {
		type: String
	},
	tvEndDate: {
		type: String
	},
	tvImpressions: {
		type: String
	},
	tvSpend: {
		type: String
	},
	semSR: {
		type: String
	},
	semCSR: {
		type: String
	},
	semPSR: {
		type: String
	},
	semOSR: {
		type: String
	},
	semBSR: {
		type: String
	},
	disSR: {
		type: String
	},
	socSR: {
		type: String
	},
	affSR: {
		type: String
	},
	parSR: {
		type: String
	},
	totSR: {
		type: String
	},
	semPR: {
		type: String
	},
	disPR: {
		type: String
	},
	socPR: {
		type: String
	},
	affPR: {
		type: String
	},
	parPR: {
		type: String
	},
	totPR: {
		type: String
	},
	run1RevRange: {
		type: String
	},
	run1ProjROI: {
		type: String
	},
	run1ROIRange: {
		type: String
	},
	semCSlideLeft: {
		type: String
	},
	semPSlideLeft: {
		type: String
	},
	semOSlideLeft: {
		type: String
	},
	semBSlideLeft: {
		type: String
	},
	disSlideLeft: {
		type: String
	},
	socSlideLeft: {
		type: String
	},
	affSlideLeft: {
		type: String
	},
	parSlideLeft: {
		type: String
	},
	semCSlide: {
		type: String
	},
	semPSlide: {
		type: String
	},
	semOSlide: {
		type: String
	},
	semBSlide: {
		type: String
	},
	disSlide: {
		type: String
	},
	socSlide: {
		type: String
	},
	affSlide: {
		type: String
	},
	parSlide: {
		type: String
	},
	semCSlideRight: {
		type: String
	},
	semPSlideRight: {
		type: String
	},
	semOSlideRight: {
		type: String
	},
	semBSlideRight: {
		type: String
	},
	disSlideRight: {
		type: String
	},
	socSlideRight: {
		type: String
	},
	affSlideRight: {
		type: String
	},
	parSlideRight: {
		type: String
	},
	semCSlideDivMin: {
		type: String
	},
	semPSlideDivMin: {
		type: String
	},
	semOSlideDivMin: {
		type: String
	},
	semBSlideDivMin: {
		type: String
	},
	disSlideDivMin: {
		type: String
	},
	socSlideDivMin: {
		type: String
	},
	affSlideDivMin: {
		type: String
	},
	parSlideDivMin: {
		type: String
	},
	semCSlideDivMax: {
		type: String
	},
	semPSlideDivMax: {
		type: String
	},
	semOSlideDivMax: {
		type: String
	},
	semBSlideDivMax: {
		type: String
	},
	disSlideDivMax: {
		type: String
	},
	socSlideDivMax: {
		type: String
	},
	affSlideDivMax: {
		type: String
	},
	parSlideDivMax: {
		type: String
	},
	semAS: {
		type: String
	},
	semCAS: {
		type: String
	},
	semPAS: {
		type: String
	},
	semOAS: {
		type: String
	},
	semBAS: {
		type: String
	},
	disAS: {
		type: String
	},
	socAS: {
		type: String
	},
	affAS: {
		type: String
	},
	parAS: {
		type: String
	},
	totAS: {
		type: String
	},
	semAR: {
		type: String
	},
	disAR: {
		type: String
	},
	socAR: {
		type: String
	},
	affAR: {
		type: String
	},
	parAR: {
		type: String
	},
	totAR: {
		type: String
	},
	run2ProjROI: {
		type: String
	}
});

// Export the model schema.
module.exports = ScenarioSchema;
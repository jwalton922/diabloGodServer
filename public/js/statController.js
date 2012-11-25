'use strict';

/* Controllers */

function DiabloStatController($scope, $log, $http, $rootScope, appConstants) {

    $scope.classDps = 0;
    $scope.classLife = 0;
    $scope.classAvgParagonLvl = 0;
    $scope.classAvgEliteKills = 0;
    $scope.classCount = 0;
    $scope.classParagonBins = [];
    $scope.avgParagonLvl = {};
    $scope.avgEliteKills = {};
    $scope.charStats = {};
    $scope.statColumns = [];
    $scope.statColumn1 = [];
    $scope.statColumn2 = [];
    $scope.statColumn3 = [];
    $scope.statColumn4 = [];
    $scope.statColumns.push($scope.statColumn1);
    $scope.statColumns.push($scope.statColumn2);
    $scope.statColumns.push($scope.statColumn3);
    $scope.statColumns.push($scope.statColumn4);
    $scope.heroClassName = $("#hero-class").text();
    $scope.heroClassImage = "";
    if($scope.heroClassName === "barbarian"){
        $scope.heroClassImage = "img/barb.jpeg"
    } else if($scope.heroClassName === "demon-hunter"){
        $scope.heroClassImage = "img/demonhunter.jpeg"
    } else if($scope.heroClassName === "monk"){
        $scope.heroClassImage = "img/monk.jpeg"
    } else if($scope.heroClassName === "witch-doctor"){
        $scope.heroClassImage = "img/witchdoctor.jpeg"
    } else if($scope.heroClassName === "wizard"){
        $scope.heroClassImage = "img/wizard.jpeg"
    }
    $scope.heroClass = {};


	$scope.init = function(){
		var paramData = {};
		paramData["callback"] = "JSON_CALLBACK"
        var requestUrl = "/stats";
        var headerData = {
            "Accepts": "application/json",
            "Content-Type": "application/json"
        };
        var request = {};
        request.success = function(xhr){
            $log.log("Received item results: "+angular.toJson(xhr));

        };
        request.error = function(xhr){
            $log.log("Error getting item results: "+angular.toJson(xhr));
        };
        $http.jsonp(requestUrl, {
            params : paramData,
            headers: headerData
        }).
        success(function(data, status, headers, config){
           //$log.log("Success! data from server: "+angular.toJson(data));
            for(var i = 0; i < data.length; i++){
            	if(data[i]["analytic-name"] === "diablo.analysis.analytics.AccountParagonLevelAnalytic"){
            		//$scope.processParagonLevels(data[i]);
            	} else if(data[i]["analytic-name"] === "diablo.analysis.analytics.AccountKillsAnalytic"){
        			//$scope.processAccountKills(data[i]);
            	} else if(data[i]["analytic-name"] === "diablo.analysis.analytics.CharacterStatsAnalytic"){
            		$scope.processCharacterStats(data[i]);
            	} else if(data[i]["analytic-name"] === "diablo.analysis.analytics.ItemAttributeCommonalityAnalytic"){
            		$scope.processItemStats(data[i]);
            	} 
            	
            } 

            $scope.calculatePercentOfItemStats($scope.heroClass.itemStats);

            //$scope.createBarChart("paragonLevelChart", "Paragon Levels", $scope.avgParagonLvl.bins);
            //$scope.createBarChart("eliteKillsChart", "Elite Kills", $scope.avgEliteKills.bins);

        }).error(function(data, status, headers, config){
            $log.log("Error :(");
        });
	}



	$scope.processItemStats = function(data){
		//$log.log("Processing item stats: "+angular.toJson(data));
		$log.log("processing item stats");
		$log.log("looking for item stats for hero: "+$scope.heroClassName)
		if($scope.heroClassName == "barbarian"){
			$scope.heroClass.itemStats = data.barbarian;
		} else if($scope.heroClassName == "demon-hunter"){
			$scope.heroClass.itemStats = data["demon-hunter"];
		} else if($scope.heroClassName == "monk"){
			$log.log("found monk item stats");
			$scope.heroClass.itemStats = data.monk;
		} else if($scope.heroClassName == "witch-doctor"){
			$scope.heroClass.itemStats = data["witch-doctor"];
		} else if($scope.heroClassName == "wizard"){
			$scope.heroClass.itemStats = data.wizard;
		}
	}

    $scope.calculatePercentOfItemStats = function(data){
        $log.log("calculatePercentOfItemStats");
        for(var slot in data){
            var slotData = data[slot];
            for(var attributeGroup in slotData){
                var attributeGroupData = slotData[attributeGroup];
                $log.log("attributeGroup: "+angular.toJson(attributeGroupData));
                var count = attributeGroupData["count"];
                $log.log("count = "+count);
                var percent = count / (1.0 * $scope.classCount)*100;
                percent = Math.round(percent *100) / 100.0;
                attributeGroupData["count"] = percent;
            }
        }
    }

	$scope.processCharacterStats = function(data){
		$log.log("Processing character stats: ");
		var charStats = data.classToStatAvgMap;
		for(var charClass in charStats){
			if(charClass == $scope.heroClassName){
				$scope.heroClass.stats = charStats[charClass];
				var statsArray = [];
				for(var statKey in $scope.heroClass.stats){
                   // $log.log("stat key: "+statKey);
                    if(statKey != null){
                        if(statKey === "damage"){
                            $scope.classDps = $scope.heroClass.stats[statKey];
                            $scope.classDps = Math.round($scope.classDps*100.0)/ 100.0;
                        } else if(statKey === "life"){
                            $scope.classLife = $scope.heroClass.stats[statKey];
                            $scope.classLife = Math.round($scope.classLife*100)/100.0;
                        }
                    }
					$scope.heroClass.stats[statKey] = Math.round($scope.heroClass.stats[statKey] * 100 ) / 100.0
					statsArray.push({value: $scope.heroClass.stats[statKey], name: statKey});
				}
                console.log(angular.toJson($scope.statColumns));
				for(var j = 0; j < 4; j++){
                    $scope.statColumns[j] = [];
                    //console.log("J is: " + j);
					for(var k = 0; k < 7; k++){
						var index  = (j*7)+k;
                        //console.log("index is: " + index);
						$scope.statColumns[j].push(statsArray[index]);
					}
                    //console.log("column  = " + angular.toJson($scope.statColumns[j]));
				}
			}
		}

        var classCountMap = data.classToCountMap;
        for(charClass in classCountMap){
            if(charClass === $scope.heroClassName){
                $scope.classCount = classCountMap[charClass];
            }
        }

        var classAvgKillMap = data.classAvgEliteKillsMap;
        for(charClass in classAvgKillMap){
            if(charClass === $scope.heroClassName){
                $scope.classAvgEliteKills = classAvgKillMap[charClass];
                $scope.classAvgEliteKills = Math.round($scope.classAvgEliteKills*100)/100.0;
            }
        }
        var classAvgParagonLvlMap = data.classAvgParagonLevels;
        for(charClass in classAvgParagonLvlMap){
            if(charClass === $scope.heroClassName){
                $scope.classAvgParagonLvl = classAvgParagonLvlMap[charClass];
                $scope.classAvgParagonLvl = Math.round($scope.classAvgParagonLvl*100)/100.0;
            }
        }

        var classParagonBinsMap = data.classParagonLevelBins;
        for(charClass in classParagonBinsMap){
            if(charClass === $scope.heroClassName){
                $scope.classParagonBins = classParagonBinsMap[charClass];
                var paragonBins = []
                for(var i = 0; i <= 100; i++){
                    paragonBins.push(i);
                
                }
                $scope.createBarChart("classParagonLvls", "Paragon Level Distribution" , $scope.classParagonBins, paragonBins, "Paragon Level 0-100", "Count");
            }
        }
	}

	$scope.processAccountKills = function(data){
		//$log.log("Processingn account kills: "+angular.toJson(data));

		if($scope.avgEliteKills.date == null){
			$scope.avgEliteKills.date = data.date;
			$scope.avgEliteKills.avg = data.averageEliteKills;
			$scope.avgEliteKills.bins = data.eliteBins;
		} else {
			if(data.date >  $scope.avgEliteKills.date){
				$log.log("Updating date from: "+$scope.avgEliteKills.date+" to "+data.date);
				$scope.avgEliteKills.date = data.date;
				$scope.avgEliteKills.avg = data.averageEliteKills;
				$scope.avgEliteKills.bins = data.eliteBins;
			}
		}
	}

	$scope.processParagonLevels = function(data){
		//$log.log("Processing paragon level data: "+angular.toJson(data));
		if($scope.avgParagonLvl.date == null){
			$scope.avgParagonLvl.date = data.date;
			$scope.avgParagonLvl.avgLevel = data.averageParagonLevel;
			$scope.avgParagonLvl.bins = data.paragonLevelBins;
		} else {
			if(data.date >  $scope.avgParagonLvl.date){
				$log.log("Updating date from: "+$scope.avgParagonLvl.date+" to "+data.date);
				$scope.avgParagonLvl.date = data.date;
				$scope.avgParagonLvl.avgLevel = data.averageParagonLevel;
				$scope.avgParagonLvl.bins = data.paragonLevelBins;
			}
		}

	}
	

	$scope.heroClasses = [{className: "Barbarian", img: "img/barb.jpeg", link: "#barbTab", tabClass : "active", statid: "barbarian"}, 
	                      {className: "Demon Hunter", img: "img/demonhunter.jpeg", link : "#demonHunterTab", tabClass : "notactive", statid : "demon-hunter"}, 
	                      {className: "Monk", img: "img/monk.jpeg", link: "#monnkTab", tabClass : "notactive", statid: "monk"}, 
	                      {className: "Witch Doctor",img: "img/witchdoctor.jpeg", link: "#witchDoctorTab", tabClass: "notactive", statid: "witch-doctor"}, 
	                      {className: "Wizard", img: "img/wizard.jpeg", link: "#wizardTab", tabClass: "notactive", statid: "wizard"}];

    $scope.classTabClick = function(heroClass){
    	$log.log("class tab clicked: "+angular.toJson(heroClass));
    	for(var i = 0 ;i < $scope.heroClasses.length; i++){
    		if($scope.heroClasses[i].className === heroClass.className){
    			$log.log("Setting active class: "+heroClass.className);
    			$scope.heroClasses[i].tabClass = "active"
    		} else {
    			$scope.heroClasses[i].tabClass = "notactive";
    		}
    	}
    }

 $scope.createBarChart = function(divId, title, arrayData, ticks, xaxisLabel, yaxisLabel){
        $log.log("creating chart for: "+divId+" data: "+angular.toJson(arrayData));
        var chart = $.jqplot(divId, [arrayData], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            title: title,
            seriesColors : ["#CC0000"],
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: {
                    show: false
                },
                rendererOptions : {
                    barWidth : 12,
                    barMargin : 0,
                    barPadding : 0
                }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    label: xaxisLabel,
                    ticks: ticks,
                    tickOptions : {
                        show: false
                    }
                },
                yaxis: {
                    label: yaxisLabel,
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                }
            },
            highlighter: {
                show: false
            },
            grid: {
                drawGridLines: true,        // wether to draw lines across the grid or not.
                gridLineColor: '#FFA319',    // *Color of the grid lines.
                background: '#000000',      // CSS color spec for background color of grid.
                borderColor: '#FFA319',     // CSS color spec for border around grid.
                borderWidth: 2.0,           // pixel width of border around grid.
                renderer: $.jqplot.CanvasGridRenderer,  // renderer to use to draw the grid.
                rendererOptions: {}         // options to pass to the renderer.  Note, the default
                                    // CanvasGridRenderer takes no additional options.
            }
        });
    }

}
'use strict';

/* Controllers */

function DiabloController($scope, $log, $http, $rootScope, appConstants) {

    $scope.selectedAffixes = [];
    $scope.affixesToSelect = [];
    $scope.showAddItemButton = true;
    $scope.affixMap = {};
    $scope.currentSelection = null;
    $scope.previousSelections = [];

    $scope.resetSelectionMenu = function(){
        $scope.currentSelection = null;
        $scope.previousSelections = [];
    }
    
    //handle add item click
    $scope.handleAddItemAffixClick = function(){
        $scope.showAddItemButton = false;
        $scope.affixesToSelect = $scope.affixMap["root"];
        //$scope.previousSelections.push("root");
        $scope.currentSelection = "root";
    //$log.log("Root menu: "+angular.toJson($scope.affixMap["root"]));
    //$log.log("Root menu: "+angular.toJson($scope.rootAffixMenu));


    }
    //handle item affix selection press
    $scope.handleItemAffixClick = function(menu){
        $log.log("User selected: "+menu+" menu item");
        var nextMenu = null;
        if(menu == "Back"){
            var previousMenuName = $scope.previousSelections.pop();
            $log.log("Previous Menu = "+previousMenuName);
            nextMenu = $scope.affixMap[previousMenuName];
        } else if(menu == "Cancel"){
            $scope.affixesToSelect = [];
            $scope.showAddItemButton = true;
            //no need to continue
            return;
        } else {
            nextMenu = $scope.affixMap[menu];
            if(nextMenu != null){
                $scope.previousSelections.push($scope.currentSelection);
                $scope.currentSelection = menu;
            }
        }
        if(nextMenu != null){
            $scope.affixesToSelect = nextMenu;
        } else {
            $log.log("Have an attribute to search on!");
            $scope.selectedAffixes.push(menu);
            $scope.resetSelectionMenu();
            $scope.showAddItemButton = true;
        }

    }

    $scope.removeWhiteSpaces = function(string){
        var modifiedString = string.replace(/ /g, "_");
        $log.log(string+" with white spaces replaced = "+modifiedString);
        return modifiedString;
    }

    $scope.evaluateItem = function(){
        $log.log("evaluateItem called");
        var paramData = {};
        for(var i = 0; i < $scope.selectedAffixes.length; i++){
            var affixSpacesReplaced = $scope.removeWhiteSpaces($scope.selectedAffixes[i]);
            var affixValue = $("#"+affixSpacesReplaced).val();
            paramData[affixSpacesReplaced] = affixValue;
            $log.log("Added search param: "+affixSpacesReplaced+" = "+affixValue);
        }
        paramData["callback"] = "JSON_CALLBACK"
        var requestUrl = "/calculateItemWorth";
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
            $log.log("Success! data from server: "+angular.toJson(data));
            $scope.createCharts(data);

        }).error(function(data, status, headers, config){
            $log.log("Error :(");
        });
      
    }


    $scope.rootAffixMenu = ["Adventuring", "Basic Item Stats","Defensive Stats","Offensive Stats","Primary Attributes", "Class Resource Bonus","Skill Bonus", "Cancel"]
    $scope.primaryAttributesMenu = ["Back", "Strength", "Dexterity", "Intelligence", "Vitality", "Cancel"];
    $scope.lifeGain = ["Back", "Health from Globes","Life per Spirit Spent", "Life per Fury Spent","Life Regen", "Life on Hit", "Life Steal", "Cancel"];
    $scope.resourceBonus = ["Back", "Arcane Power on Crit", "Hatred Regen", "Mana Regen", "Max Arcane Power", "Max Discipline", "Max Fury", "Max Mana", "Spirit Regen", "Cancel"];
    $scope.basicItemStats = ["Back", "Armor", "Block Chance","DPS", "Cancel"];
    $scope.adventuring = ["Back","Bonus to XP","Gold Find", "Magic Find", "Movement Bonus", "Pickup Radius", "Reduced Level", "Cancel"];
    $scope.procEffect = ["Back", "Blind Chance","Chill Chance","Fear Chance","Freeze Chance","Immobilize Chance","Knockback Chance","Slow Chance", "Stun Chance","Cancel"];
    $scope.offensiveEffects = ["Back", "Attack Speed Increase","Crit Chance","Crit Damage Bonus","Elite Damage Bonus","Proc Effects","Cancel"];
    $scope.defensiveEffects = ["Back", "Crowd Control Reduction","Life Gain","Reduced Melee Damage","Reduced Range Damage","Resistances","Cancel"];



    $scope.affixMap["root"] = $scope.rootAffixMenu;
    $scope.affixMap["Primary Attributes"] = $scope.primaryAttributesMenu;
    $scope.affixMap["Basic Item Stats"] = $scope.basicItemStats;
    $scope.affixMap["Defensive Stats"] = $scope.defensiveEffects;
    $scope.affixMap["Offensive Stats"] = $scope.offensiveEffects;
    $scope.affixMap["Class Resource Bonus"] = $scope.resourceBonus;
    $scope.affixMap["Life Gain"] = $scope.lifeGain;
    $scope.affixMap["Proc Effects"] = $scope.procEffect;
    $scope.affixMap["Adventuring"] = $scope.adventuring;

    $scope.createBarChart = function(divId, title, arrayData){
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
                    tickOptions : {

                    }
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

    $scope.createCharts2 = function(data){
        var accountParagonLevels= $.jqplot('accountParagonLevel', [data["account_paragon_levels"]], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            title: "Account Paragon Levels",
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
                    tickOptions : {

                    }
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


        var accountEliteKills = $.jqplot('accountEliteKills', [data["account_elite_kills"]], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            title: "Account Elite Kills",
            seriesColors : ["#CC0000"],
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: {
                    show: false
                },
                rendererOptions : {
                    barWidth : 8,
                    barMargin : 0,
                    barPadding : 0
                }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    tickOptions : {

                    }
                }
            },
            highlighter: {
                show: false
            }
        });

        var accountProgress = $.jqplot('accountProgress', [data["account_progress"]], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            title: "Account Progress",
            seriesColors : ["#CC0000"],
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: {
                    show: false
                },
                rendererOptions : {
                    barWidth : 10,
                    barMargin : 0,
                    barPadding : 0
                },
                shadow : false
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    tickOptions : {
                        showLabel : false,
                        show: false
                    }
                    
                }
            },
            highlighter: {
                show: false
            }
        });

    }
    
    /**** Begin New World Order **********/
    $scope.selectedClass = "";
    $scope.charClass = ["Barbarian", "Demon Hunter" , "Monk", "Witch Doctor", "Wizard"];
    $scope.slots = ["head", "torso", "feet", "hands", "legs", "bracers", "neck", "finger", "wapon", "off hand", "waist", "sholders"];
    $scope.selectedSlot = $scope.slots[0]
    $scope.availbleAttrs = _.keys(affixes).sort();

    $scope.rankGt = null;
    $scope.rankLt = null;
    $scope.accountEliteKillsGt = 0;
    $scope.accountEliteKillsLt = 0;
    $scope.characterEliteKillsGt = 0;
    $scope.characterEliteKillsLt = 0;
    $scope.accountParagonLevelGt = 0;
    $scope.accountParagonLevelLt = 0;
    $scope.characterParagonLevelGt = 0;
    $scope.characterParagonLevelLt = 0;
    $scope.estGoldEarned = 0;


    $scope.providedAttributes = [
                                    {name: "", value: null},
                                    {name: "", value: null},
                                    {name: "", value: null},
                                    {name: "", value: null},
                                    {name: "", value: null},
                                    {name: "", value: null},
                                    {name: "", value: null},
                                    {name: "", value: null},
                                ];
    $scope.processing = false;
    $scope.submitAttributes = function(){
        $log.log("submitAttributes called");
        var paramData = {};
        for(var i = 0; i < $scope.providedAttributes.length; i++){
            if($scope.providedAttributes[i].value > 0){
               paramData[$scope.providedAttributes[i].name] = $scope.providedAttributes[i].value;
            }
            
        }

        if($scope.selectedSlot != null && $scope.selectedSlot.length > 0){
            paramData["slot"] = $scope.selectedSlot;
        }

        $log.log("paramData = "+angular.toJson(paramData));
        paramData["callback"] = "JSON_CALLBACK"
        var requestUrl = "/calculateItemWorth";
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
            $log.log("Success! data from server: "+angular.toJson(data));
            $scope.processing = false;
            $scope.rankGt = data.stats["num_gt"];
            $scope.rankLt = data.stats["num_lt"];
            $scope.accountEliteKillsGt = data.stats["acct_elite_avg"]["gt"];
            $scope.accountEliteKillsLt = data.stats["acct_elite_avg"]["lt"];
            $scope.characterEliteKillsGt = data.stats["char_elite_avg"]["gt"];
            $scope.characterEliteKillsLt = data.stats["char_elite_avg"]["lt"];
            $scope.accountParagonLevelGt = data.stats["acct_plvl_avg"]["gt"];
            $scope.accountParagonLevelLt = data.stats["acct_plvl_avg"]["lt"];
            $scope.characterParagonLevelGt = data.stats["char_plvl_avg"]["gt"];
            $scope.characterParagonLevelLt = data.stats["char_plvl_avg"]["lt"];
            $scope.estGoldEarned = data.stats["avg_gold_lt"];

            $scope.createBarChart("acctEliteKillsGt", "Elite Kills Distribution for Better Items", data["account_elite_kills"]["gt"]);
            $scope.createBarChart("acctEliteKillsLt", "Elite Kills Distribution for Worse Items", data["account_elite_kills"]["lt"]);
            $scope.createBarChart("acctPlvlGt", "Paragon Level Distribution for Better Items", data["account_paragon_levels"]["gt"]);
            $scope.createBarChart("acctPlvlLt", "Paragon Level Distribution for Worse Items", data["account_paragon_levels"]["lt"]);

            //$scope.createCharts(data);

        }).error(function(data, status, headers, config){
            $log.log("Error :(");
            $scope.processing = false;
        });
        $scope.processing = true;
    }
};

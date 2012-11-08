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

    $scope.createCharts = function(data){
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
    $scope.slot = "";
    $scope.slots = ["head", "torso", "feet", "hands", "legs", "bracers", "neck", "finger", "wapon", "off hand", "waist", "sholders"];

    $scope.availbleAttrs = _.keys(affixes).sort();

    $scope.providedAttributes = [
                                    {name: "", value: 0},
                                    {name: "", value: 0},
                                    {name: "", value: 0},
                                    {name: "", value: 0},
                                    {name: "", value: 0},
                                    {name: "", value: 0},
                                    {name: "", value: 0},
                                    {name: "", value: 0},
                                ];
};

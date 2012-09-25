class ItemController < ApplicationController
  #Block_Amount_Item_Min
  #Block_Amount_Item_Delta
  #Block_Chance_Bonus_Item
  #Weapon_On_Hit_Bleed_Proc_Chance
  #Weapon_On_Hit_Bleed_Proc_Damage_Delta
  #Weapon_On_Hit_Bleed_Proc_Damage_Base

  #Item_Indestructible
  #Damage_Percent_Reduction_From_Type#Lightning
  #Armor_Item_Percent
  #Damage_Type_Percent_Bonus#Lightning
  #Damage_Dealt_Percent_Bonus#Lightning
  #Damage_Type_Percent_Bonus#Arcane
  #Damage_Type_Percent_Bonus#Fire
  #Damage_Type_Percent_Bonus#Cold
  #Damage_Dealt_Percent_Bonus#Fire
  #Damage_Percent_Bonus_Vs_Monster_Type#Demon
  #Damage_Percent_Reduction_From_Elites
  #Damage_Type_Percent_Bonus#Holy
  #Damage_Dealt_Percent_Bonus#Cold
  #Damage_Percent_Bonus_Vs_Monster_Type#Undead
  #Damage_Percent_Bonus_Vs_Monster_Type#Human
  #Damage_Percent_Bonus_Vs_Monster_Type#Beast
  #Experience_Bonus_Percent
  @@affixes = {}
  @@affixes["elite_damage"] = "Damage_Percent_Bonus_Vs_Elites"
  @@affixes["dps"] = "dps"
  @@affixes["strength"] = "Strength_Item"
  @@affixes["intelligence"] = "Intelligence_Item"
  @@affixes["dexterity"] = "Dexterity_Item"
  @@affixes["vitality"] = "Vitality_Item"
  @@affixes["all_resistance"] = "Resistance_All"
  @@affixes["fire_resistance"] = "Resistance#Fire"
  @@affixes["lightning_resistance"] = "Resistance#Lightning"
  @@affixes["arcane_resistance"] = "Resistance#Arcane"
  @@affixes["cold_resistance"] = "Resistance#Cold"
  @@affixes["physical_resistance"] = "Resistance#Physical"
  @@affixes["poison_resistance"] = "Resistance#Poison"
  @@affixes["health_from_globe"] = "Health_Globe_Bonus_Health"
  @@affixes["life_percent"] = "Hitpoints_Max_Percent_Bonus_Item"
  @@affixes["life_after_kill"] = "Hitpoints_On_Kill"
  @@affixes["life_on_hit"] = "Hitpoints_On_Hit"
  @@affixes["life_per_spirt_spent"] = "Spending_Resource_Heals_Percent#Spirit"
  @@affixes["life_per_fury_spent"] = "Spending_Resource_Heals_Percent#Fury"
  @@affixes["life_regen"] = "Hitpoints_Regen_Per_Second"
  @@affixes["life_steal"] = "Steal_Health_Percent"
  @@affixes["attack_speed"] = "Attacks_Per_Second_Item_Percent"
  @@affixes["crit_chance"] = "Crit_Percent_Bonus_Capped"
  @@affixes["crit_damage"] = "Crit_Damage_Percent"
  @@affixes["armor"] = "Armor_Item"
  @@affixes["block_chance"] = "Block_Chance_Item"
  @@affixes["crowd_control_reduction"] = "CrowdControl_Reduction"
  @@affixes["reduce_melee_damage"] = "Damage_Percent_Reduction_From_Melee"
  @@affixes["reduce_range_damage"] = "Damage_Percent_Reduction_From_Ranged"
  @@affixes["thorn_damage"] = "Thorns_Fixed#Physical"
  @@affixes["arcane_power_on_crit"] = "Resource_On_Crit#Arcanum"
  @@affixes["hatred_regen"] = "Resource_Regen_Per_Second#Hatred"
  @@affixes["mana_regen"] = ""
  @@affixes["max_arcane_power"] = "Resource_Max_Bonus#Arcanum"
  @@affixes["max_dicipline"] = "Resource_Max_Bonus#Discipline"
  @@affixes["max_fury"] = "Resource_Max_Bonus#Fury"
  @@affixes["max_mana"] = "Resource_Regen_Per_Second#Mana"
  @@affixes["spirit_regen"] = "Resource_Regen_Per_Second#Spirit"
  @@affixes["Bonus_to_Experience"] = "Experience_Bonus"
  @@affixes["gold_find"] = "Gold_Find"
  @@affixes["sockets"] = "Sockets"
  @@affixes["magic_find"] = "Magic_Find"
  @@affixes["movement_speed"] = "Movement_Scalar"
  @@affixes["pickup_radius"] = "Gold_PickUp_Radius"
  @@affixes["reduced_level"] = "Item_Level_Requirement_Reduction"
  @@affixes["blind_chance"] = "Blind_Proc_Chance"
  @@affixes["chill_chance"] = "On_Hit_Chill_Proc_Chance"
  @@affixes["fear_chance"] = "On_Hit_Fear_Proc_Chance"
  @@affixes["freeze_chance"] = "On_Hit_Freeze_Proc_Chance"
  @@affixes["immobilize_chance"] = "On_Hit_Immobilize_Proc_Chance"
  @@affixes["knockback_chance"] = "On_Hit_Knockback_Proc_Chance"
  @@affixes["slow_chance"] = "On_Hit_Slow_Proc_Chance"
  @@affixes["stun_chance"] = "On_Hit_Stun_Proc_Chance"
  @@affixes["ancient_spear"] = "Power_Damage_Percent_Bonus#Barbarian_AncientSpear"
  @@affixes["bash"] = "Power_Damage_Percent_Bonus#Barbarian_Bash"
  @@affixes["cleave"] = "Power_Damage_Percent_Bonus#Barbarian_Cleave"
  @@affixes["frenzy"] = "Power_Damage_Percent_Bonus#Barbarian_Frenzy"
  @@affixes["hammer_of_ancients"] = "Power_Resource_Reduction#Barbarian_HammerOfTheAncients"
  @@affixes["overpower"] = "Power_Crit_Percent_Bonus#Barbarian_Overpower"
  @@affixes["rend"] = "Power_Resource_Reduction#Barbarian_Rend"
  @@affixes["revenge"] = "Power_Crit_Percent_Bonus#Barbarian_Revenge"
  @@affixes["seismic_slam"] = ""
  @@affixes["weapon_throw"] = "Power_Damage_Percent_Bonus#Barbarian_WeaponThrow"
  @@affixes["weapon_throw_fury_reduction"] = "Power_Resource_Reduction#Barbarian_WeaponThrow"
  @@affixes["whirlwind"] = "Power_Crit_Percent_Bonus#Barbarian_Whirlwind"
  @@affixes["bola_shot"] = "Power_Damage_Percent_Bonus#DemonHunter_BolaShot"
  @@affixes["chakram"] = "Power_Resource_Reduction#DemonHunter_Chakram"
  @@affixes["cluster_arrow"] = "Power_Resource_Reduction#DemonHunter_ClusterArrow"
  @@affixes["elemental_arrow"] = "Power_Damage_Percent_Bonus#DemonHunter_ElementalArrow"
  @@affixes["entangling_shot"] = "Power_Damage_Percent_Bonus#DemonHunter_EntanglingShot"
  @@affixes["evasive_fire"] = "Power_Damage_Percent_Bonus#DemonHunter_EvasiveFire"
  @@affixes["grenades"] = "Power_Damage_Percent_Bonus#DemonHunter_Grenades"
  @@affixes["hungering_arrow"] = "Power_Damage_Percent_Bonus#DemonHunter_HungeringArrow"
  @@affixes["impale"] = "Power_Resource_Reduction#DemonHunter_Impale"
  @@affixes["multishot"] = "Power_Crit_Percent_Bonus#DemonHunter_Multishot"
  @@affixes["rapid_fire"] = "Power_Crit_Percent_Bonus#DemonHunter_RapidFire"
  @@affixes["spike_trap"] = "Power_Damage_Percent_Bonus#DemonHunter_SpikeTrap"
  @@affixes["strafe"] = "Power_Crit_Percent_Bonus#DemonHunter_Strafe"
  @@affixes["crippling_wave"] = "Power_Damage_Percent_Bonus#Monk_CripplingWave"
  @@affixes["cyclone_strike"] = "Power_Resource_Reduction#Monk_CycloneStrike"
  @@affixes["deadly_reach"] = "Power_Damage_Percent_Bonus#Monk_DeadlyReach"
  @@affixes["exploding_palm"] = "Power_Damage_Percent_Bonus#Monk_ExplodingPalm"
  @@affixes["fists_of_thunder"] = "Power_Damage_Percent_Bonus#Monk_FistsofThunder"
  @@affixes["lashing_tail_kick"] = "Power_Resource_Reduction#Monk_LashingTailKick"
  @@affixes["sweeping_wind"] = "Power_Damage_Percent_Bonus#Monk_SweepingWind"
  @@affixes["tempest_rush"] = "Power_Crit_Percent_Bonus#Monk_TempestRush"
  @@affixes["wave_of_light"] = "Power_Crit_Percent_Bonus#Monk_WaveOfLight"
  @@affixes["way_of_the_hundred_fists"] = "Power_Damage_Percent_Bonus#Monk_WayOfTheHundredFists"
  @@affixes["acid_cloud"] = "Power_Crit_Percent_Bonus#Witchdoctor_AcidCloud"
  @@affixes["corpse_spiders"] = "Power_Damage_Percent_Bonus#Witchdoctor_CorpseSpider"
  @@affixes["firebats"] = "Power_Resource_Reduction#Witchdoctor_Firebats"
  @@affixes["firebomb"] = "Power_Resource_Reduction#Witchdoctor_Firebomb"
  @@affixes["haunt"] = "Power_Damage_Percent_Bonus#Witchdoctor_Haunt"
  @@affixes["locust_swarm"] = "Power_Damage_Percent_Bonus#Witchdoctor_Locust_Swarm"
  @@affixes["plague_of_toads"] = "Power_Damage_Percent_Bonus#Witchdoctor_PlagueOfToads"
  @@affixes["poison_dart"] = "Power_Damage_Percent_Bonus#Witchdoctor_PoisonDart"
  @@affixes["spirit_barrage"] = "Power_Damage_Percent_Bonus#Witchdoctor_SpiritBarrage"
  @@affixes["zombie_dog"] = "Power_Cooldown_Reduction#Witchdoctor_SummonZombieDog"
  @@affixes["wall_of_zombies"] = ""
  @@affixes["zombie_charger"] = "Power_Resource_Reduction#Witchdoctor_ZombieCharger"
  @@affixes["arcane_orb"] = "Power_Crit_Percent_Bonus#Wizard_ArcaneOrb"
  @@affixes["arcane_torrent"] = "Power_Resource_Reduction#Wizard_ArcaneTorrent"
  @@affixes["blizzard"] = "Power_Duration_Increase#Wizard_Blizzard"
  @@affixes["disintegrate"] = "Power_Resource_Reduction#Wizard_Disintegrate"
  @@affixes["electrocute"] = "Power_Damage_Percent_Bonus#Wizard_Electrocute"
  @@affixes["energy_twister"] = "Power_Crit_Percent_Bonus#Wizard_EnergyTwister"
  @@affixes["explosive_blast"] = "Power_Crit_Percent_Bonus#Wizard_ExplosiveBlast"
  @@affixes["hydra"] = "Power_Resource_Reduction#Wizard_Hydra"
  @@affixes["magic_missile"] = ""
  @@affixes["meteor"] = "Power_Resource_Reduction#Wizard_Meteor"
  @@affixes["ray_of_frost"] = "Power_Crit_Percent_Bonus#Wizard_RayOfFrost"
  @@affixes["spectral_blade"] = "Power_Damage_Percent_Bonus#Wizard_SpectralBlade"
  @@affixes["shock_pulse"] = "Power_Damage_Percent_Bonus#Wizard_ShockPulse"

  @@paragonLevelBoundary = []
  @@paragonLevelBoundary
  21.times do |i|
    logger.debug("i = #{i}")
    @@paragonLevelBoundary << (i*5)
  end


  def calc_item_stats
    logger.info("calculating item stats")
    # Getting at the mongodb instance
    query = {}
    count_query = {}
    params.each do |key, val|
      key = key.downcase
      logger.debug("#{key} = #{val}")
      if(key.end_with?("_val"))
        #do nothing
      else
        logger.debug("Looking up value: "+key)
        if(@@affixes == nil)
          logger.debug("AFFIXES IS NIL!")
        end
        affix_key = @@affixes[key]
        if(affix_key == nil || affix_key.length == 0)
          logger.debug("Could not find affix key for: "+key)
        else
          logger.debug("Setting query value")
          greater_than_map = {}
          greater_than_map["$gt"] = val.to_f
          affix_value = greater_than_map
          query[affix_key] = affix_value
          count_query[affix_key] = 0
        end
      end
    end
    logger.info("query object = #{query.to_s}")
    connection = MongoMapper.connection
    db = connection['diablo']
    db.authenticate('diabloUser', 'diabloUser')
    collection = db['items']


    cursor = collection.find(query)
    count = collection.count(query) #THIS DOESN'T WORK, PROVIDES COUNT OF COLLECTION IGNORES QUERY
    
    paragon_level_divs = []
    account_elite_kills = []
    character_elite_kills = []
    character_progress_data = []
    account_progress_data = []
    paragon_levels = []
    account_paragon_levels = []
    11.times do |i|
      character_elite_kills << 0
      account_elite_kills << 0
    end

    17.times do |i|
      character_progress_data << 0
      account_progress_data << 0
    end

    21.times do |i|
      paragon_levels << 0
      account_paragon_levels << 0
      paragon_level_divs << (i*5)
    end
  
    it_count = 0
    cursor.each do |item|
      it_count = it_count+1
      #paragon levels
      item_character_paragon_level = item["characterParagonLevel"]
      item_account_paragon_level = item["accountMaxParagonLevel"]
      character_index = item_character_paragon_level/5.0
      character_index = character_index.floor
      account_index = item_account_paragon_level/5.0
      account_index = account_index.floor
      paragon_levels[character_index] = paragon_levels[character_index] +1
      account_paragon_levels[account_index] = account_paragon_levels[account_index] +1
      #elite kills
      character_kills = item["characterEliteKills"]
      account_kills = item["accountEliteKills"]
      character_kills_index = character_kills / 2000.0
      character_kills_index = character_kills.floor
      if(character_kills_index > 10)
        character_kills_index = 10
      end
      account_kills_index = account_kills / 2000.0
      account_kills_index = account_kills_index.floor
      #logger.debug("account kills: #{account_kills} index : #{account_kills_index}")
      if(account_kills_index > 10)
        account_kills_index = 10
      end
      character_elite_kills[character_kills_index] = character_elite_kills[character_kills_index]+1
      account_elite_kills[account_kills_index] = account_elite_kills[account_kills_index]+1
      #progress
      character_progress = item["characterProgress"].to_i
      account_progress = item["accountProgress"].to_i
      character_progress_data[character_progress] = character_progress_data[character_progress]+1
      account_progress_data[account_progress] = account_progress_data[account_progress]+1
    end

    logger.debug("count = #{count} it_count = #{it_count} level index: #{paragon_levels.to_s}")
    logger.debug("ACCOUTN ELITE KILLS: #{account_elite_kills.to_s}")
    #convert counts to pecentages

    paragon_levels = convert_values_to_percentages(paragon_levels, it_count)
    account_paragon_levels = convert_values_to_percentages(account_paragon_levels, it_count)
    character_elite_kills = convert_values_to_percentages(account_elite_kills, it_count)
    account_elite_kills = convert_values_to_percentages(account_elite_kills, it_count)
    character_progress_data = convert_values_to_percentages(character_progress_data, it_count)
    account_progress_data = convert_values_to_percentages(account_progress_data, it_count)

    return_obj = {}
    return_obj["character_paragon_levels"] = paragon_levels
    return_obj["account_paragon_levels"] = account_paragon_levels
    return_obj["paragon_level_divs"] = paragon_level_divs
    return_obj["character_elite_kills"] = character_elite_kills
    return_obj["account_elite_kills"] = account_elite_kills
    return_obj["character_progress"] = character_progress_data
    return_obj["account_progress"] = account_progress_data

    logger.debug("return obj: #{return_obj.to_json}")
    render :json => return_obj.to_json, :callback => params[:callback]


    # Display a collection (note: 'each' does an implicit 'to_a()')
    #MongoMapper.database['questions'].find({}).each {|x| puts x.inspect}

    # In the Question model you can use this shortcut
    # collection to get at the questions collection
    #collection.find({}).to_a
  end

  def convert_values_to_percentages(data, total)
    sum = 0.0
    data.each_with_index {|val, index|
      data[index] = (data[index]/(1.0*total))*100
      sum = sum+data[index]
    }
    logger.debug("SUM = #{sum} data = #{data.to_s}")
    return data
  end
end

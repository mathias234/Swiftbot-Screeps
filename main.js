var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleTower = require('role.tower');
var spawnCreeps = require('world.respawnCreeps');
var getSource = require('world.getSource');
var buildRoads = require('world.builder');
var ui = require('room.ui');
var alliance = require('game.alliance');

module.exports.loop = function () {
    Game.toggleUi = function () {
        Memory.showUi = !Memory.showUi;
    }

    Game.addToAlliance = alliance.addToAlliance;

    Memory.CPU = Game.cpu;

    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        if (room.controller.owner == undefined) {
            var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
            for (var claimer of claimers) {
                if (claimer.reserveController(room.controller) == ERR_NOT_IN_RANGE)
                    claimer.moveTo(room.controller);
            }
        }

        ui.run(room);
    }


    for (const i in Game.spawns) {
        buildRoads.run(Game.spawns[i].room);
    }

    spawnCreeps.run();

    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];


        var conSites = room.find(FIND_CONSTRUCTION_SITES);
        for (var site of conSites) {
            if (site.progress == 0)
                continue;

            room.visual.text(
                '🛠️' + ((site.progress / site.progressTotal) * 100).toFixed(2) + "%",
                site.pos.x + 1,
                site.pos.y,
                { align: 'left', opacity: 0.8 });
        }

        var site = room.controller;

        room.visual.text(
            '🛠️' + ((site.progress / site.progressTotal) * 100).toFixed(2) + "%",
            site.pos.x + 1,
            site.pos.y,
            { align: 'left', opacity: 0.8 });


        var towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

        for (var tower of towers) {
            roleTower.run(tower);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        // Leave sources if its close to dying
        if (creep.ticksToLive <= 5) {
            getSource.leaveSource(creep);
            continue;
        }

        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: c => alliance.isCreepFriendly(c) });
        if (target) {
            // Scramble all creeps with ATTACK or RANGED_ATTACK body parts to defend the base, stop all work
            if (creep.memory.role == 'attack_melee' || creep.memory.role == 'attack_ranged') {
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                creep.say("Attacking");
                continue;
            }
            else { // If creep cannot attack, go to spawn

            }
        }

        var harvesters = creep.room.find(FIND_MY_CREEPS, { filter: c => c.memory.role == 'harvester' })
        // this creep's room has no harvesters, i will default to one
        if (harvesters.length == 0) {
            roleHarvester.run(creep);
            continue;
        }

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
    }
}
var getSource = require('world.getSource');

var roleHarvester = {
    run: function (creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER)
                    && (structure.energy < structure.energyCapacity)) ||
                    ((structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE)
                        && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });

        targets = _.sortBy(targets, function (structure) {
            return structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER
        }).reverse();


        if (creep.carry.energy == 0) {
            creep.memory.emptying = false;
        }
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.emptying = true;
        }

        if (!creep.memory.emptying) {
            var target;
            if (creep.memory.targetId == undefined) {
                var src = getSource.getAnyFreeSource(creep);
                if (src != null)
                    target = src;
            }

            if (target == undefined || target == null || targets == 0) {
                getSource.leaveSource(creep); // make sure we are not assigned to any sources

                var idleFlag = creep.room.find(FIND_FLAGS, { filter: flag => flag.name.includes('Idle') && flag.pos.roomName == creep.room.name });
                creep.moveTo(idleFlag);
            }
            else if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {

            getSource.leaveSource(creep);
            creep.memory.targetId = undefined;
            if (targets.length > 0) {
                var transferErr = creep.transfer(targets[0], RESOURCE_ENERGY);
                if (transferErr == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else { // All energy stores are full, so we just wait outside one
                var targets2 = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE);
                    }
                });
                creep.moveTo(targets2[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};


module.exports = roleHarvester;
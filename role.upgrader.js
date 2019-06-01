var getSource = require('world.getSource');


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 resupply');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            getSource.leaveSource(creep);
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            creep.upgradeController(creep.room.controller);

            if (creep.pos.getRangeTo(creep.room.controller) >= 1) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            })[0];

            var target = container;

            if (target != undefined || target != null) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else { // theres no containers with any energy, try to harvest instead
                var target;
                if (creep.memory.targetId == undefined) {
                    var src = getSource.getAnyFreeSource(creep);
                    if (src != null)
                        target = src;
                }

                if (target == undefined || target == null) {
                    var idleFlag = creep.room.find(FIND_FLAGS, { filter: flag => flag.name.includes('Idle') && flag.pos.roomName == creep.room.name });
                    creep.moveTo(idleFlag[0]);
                }

                else if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleUpgrader;
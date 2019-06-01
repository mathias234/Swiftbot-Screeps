function findNewTarget(tower) {
    var damagedStructures = tower.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });

    return _.sortBy(damagedStructures, function (str) {
        return str.hits;
    })[0];
}


var roleTower = {
    run: function (tower) {
        if (tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                return;
            }

            var damagedCreeps = tower.room.find(FIND_MY_CREEPS, { filter: (creep) => creep.hits < creep.hitsMax });

            if (damagedCreeps.length > 0) {
                console.log("Healing creep: " + damagedCreeps[0].name + "(" + damagedCreeps[0].hits + " : " + damagedCreeps[0].hitsMax + ")");

                tower.heal(damagedCreeps[0]);
                return;
            }


            // var closestDamagedStructure = findNewTarget(tower);
            // if (closestDamagedStructure) {
            //     tower.repair(closestDamagedStructure);
            //     return;
            // }

        }
    }
};


module.exports = roleTower;
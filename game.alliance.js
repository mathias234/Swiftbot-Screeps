var alliance = {
    addToAlliance: function (ownerName) {
        if (Memory.alliance == undefined)
            Memory.alliance = [];

        Memory.alliance.push(ownerName);
    },

    isCreepFriendly: function (creep) {
        for (var member in Memory.alliance) {
            if (creep.owner == member) {
                return true;
            }
        }

        return false;
    }
}

module.exports = alliance;
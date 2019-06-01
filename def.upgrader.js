var baseDef = require('def.base');

module.exports = {
    getBody: function getBodyForHarvester(room) {
        var roomExts = baseDef.getRoomExtensions(room);
        if (roomExts <= 4) {
            return {
                tier: 0,
                body: [
                    MOVE,
                    WORK,
                    CARRY
                ]
            }
        }
        else if (roomExts <= 9) {
            return {
                tier: 1,
                body: [
                    MOVE, MOVE,
                    WORK, WORK,
                    CARRY, CARRY
                ]
            }
        }
        else if (roomExts <= 19) {
            return {
                tier: 2,
                body: [
                    MOVE, MOVE, MOVE, MOVE,
                    WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY
                ]
            }
        }
        else if (roomExts <= 29) {
            return {
                tier: 3,
                body: [
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    WORK, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
                ]
            }
        }
        else //if (roomExts <= 39) {
        {
            return {
                tier: 4,
                body: [
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY
                ]
            }
        }
    }
}
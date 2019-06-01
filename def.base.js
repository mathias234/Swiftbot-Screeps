module.exports = {
    getRoomExtensions: function (room) {
        return room.find(FIND_STRUCTURES, { filter: str => str.structureType == STRUCTURE_EXTENSION });
    }
}
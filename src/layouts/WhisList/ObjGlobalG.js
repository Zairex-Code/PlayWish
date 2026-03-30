//objeto gobal de juegos
const WishList = (()=>{
    const List ={
        _games : {}
    }

    return{
        set: (id, game) =>List._games[id] = {...game, updatedAt : new Date()},
        get: (id) => List._games[id] || {message : "Juego descontinuado o no encontrado"},
        getAll :() => Object.values(List._games),
        remove: (id)       => delete List._games[id]
    }
})()

export default WishList
var mongoose = require('mongoose');

var DagSchema = mongoose.Schema({
    proyecto: String,
    nodes: [{
        title: String,
        id: Number,
        x: Number,
        y: Number,
        configurado: {
            location: String,
            name: String,
            version: String,
            description: String,
            useDocker: Boolean,
            image: String,
            argumento: String,
            file: [mongoose.Schema.Types.Mixed],
            render: [mongoose.Schema.Types.Mixed],
                /*[{
                               filename : String,
                               id : String,
                               type : String
                           }]*/
        }
    }],
    edges: [{
        source: {
            title: String,
            id: Number,
            x: Number,
            y: Number,
        },
        target: {
            title: String,
            id: Number,
            x: Number,
            y: Number
        },
    }],
    date: {
        type: Date,
        default: Date.now
    },
    userid: String,
    descripcion: String,
    ejecuciones: [Date],
    nombre: String,
    imagen: String
});

module.exports = mongoose.model('Dag', DagSchema);

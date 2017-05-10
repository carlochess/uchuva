var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var DagSchema = mongoose.Schema({
    proyecto: String,
    workloader:String,
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
            raw: Number,
            times: Number,
            wd : String,
            module : String,
            file: [mongoose.Schema.Types.Mixed],
            render: [mongoose.Schema.Types.Mixed]
        }
    }],
    edges: [{
        source: {
            title: String,
            id: Number,
            x: Number,
            y: Number
        },
        target: {
            title: String,
            id: Number,
            x: Number,
            y: Number
        }
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
DagSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Dag', DagSchema);

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var DagExeSchema = mongoose.Schema({
    proyecto: String,
    workloader:String,
    nodes: [{
		title: String,
		id: Number,
		x: Number,
		y: Number,
		NodeStatus: String,
		StatusDetail: String,
		configurado : {
		    programa: String,
                    location : String,
		    useDocker : Boolean,
		    image: String,
        argumento : String,
        raw: Number,
        times: Number,
        file: [mongoose.Schema.Types.Mixed]
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

    date: { type: Date, default: Date.now },
    userid: String,
    descripcion: String,
    ejecuciones : [Date],
    nombre : String,
    imagen : String,
    tipo : Number
});
DagExeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('DagExe', DagExeSchema);

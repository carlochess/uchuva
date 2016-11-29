var mongoose = require('mongoose');

var DagExeSchema = mongoose.Schema({
    proyecto: String,
    nodes: [{
		title: String,
		id: Number,
		x: Number,
		y: Number,
		NodeStatus: String,
		StatusDetail: String,
		configurado : {
		    programa: String,
		    useDocker : Boolean,
		    image: String,
        argumento : String,
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

module.exports = mongoose.model('DagExe', DagExeSchema);

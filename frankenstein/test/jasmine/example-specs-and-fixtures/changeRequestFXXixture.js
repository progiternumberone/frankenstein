define([ "backbone" ]

, function( Backbone ) {

return {
  GET: {
    changeRequests: [new Backbone.Model({
	ControlRecordChangeRequestSystemId: "1"
}),
new Backbone.Model({
	ControlRecordChangeRequestSystemId: "2"
})
]
  }
};
});

/*define({
  GET: {
    changeRequests: [new Backbone.Model({
	ControlRecordChangeRequestSystemId: "1"
}),
new Backbone.Model({
	ControlRecordChangeRequestSystemId: "2"
})
]
  }
});*/
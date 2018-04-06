const GAME_SETTINGS = [	

	{	
		display_name:"Max Players",
		class:"numberSetting",
		name:"maxPlayers",
		type:"number",
		max:10,
		min:4,
		default:10
	},
	{
		display_name:"Points to Win",
		class:"numberSetting",
		name:"winPoints",
		type:"number",
		max:99,
		min:2,
		default:5
	},
	{
		display_name:"Turn Duration",
		class:"numberSetting",
		name:"turnDuration",
		type:"number",
		max:120,
		min:0,
		default:30
	},
	{
		display_name:"Blank Cards",
		class:"numberSetting",
		name:"blankCards",
		type:"number",
		max:50,
		min:0,
		default:0
	},	
	{
		display_name:"Password",
		class:"passwordSetting",
		name:"password",
		type:"password",
		max:60,
		min:0,
		default:""
	}

];

module.exports = GAME_SETTINGS;
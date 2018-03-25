export const GAME_SETTINGS = [	
	{
		display_name:"Game Name",
		class:"game_name",
		name:"game_name",
		type:"text",
		max:60,
		min:3,
		default:""
	},
	{	
		display_name:"Max Players",
		class:"number_setting",
		name:"max_players",
		type:"number",
		max:10,
		min:4,
		default:10
	},
	{
		display_name:"Points to Win",
		class:"number_setting",
		name:"win_points",
		type:"number",
		max:99,
		min:2,
		default:5
	},
	{
		display_name:"Turn Duration",
		class:"number_setting",
		name:"turn_duration",
		type:"number",
		max:120,
		min:0,
		default:"30"
	},
	{
		display_name:"Blank Cards",
		class:"number_setting",
		name:"blank_cards",
		type:"number",
		max:50,
		min:0,
		default:0
	},	
	{
		display_name:"Password",
		class:"password_setting",
		name:"password",
		type:"password",
		max:60,
		min:0,
		default:""
	}

];

export default GAME_SETTINGS;
window.onload = function () {
var app = new Vue({
    el: "#app",
    data: {
      state : {},
      chartOptions: {
        elements: {
            point:{
                radius: 0
            }
        },
        scales:{
            xAxes: [{
                display: false
            }]
        }
      },
      userName: ""
    },
    methods: {
    	getState: function () {
    		axios.get("api/state").then(response => {
	            this.state = response.data;
				setTimeout(() => {this.getState();}, 60000);
			});
    	},
    	addUser: function () {
    		axios.post("api/user/add",{'userName':this.userName}).then(response => {
	            this.state = response.data;
			});
    	},
    	removeUser: function (userName) {
    		const confirmRemove = confirm("Are you sure you want to remove "+userName+"?");
			if (confirmRemove == true) {
	    		axios.post("api/user/remove",{'userName':userName}).then(response => {
		            this.state = response.data;
				});
    		}
    	},
    	drink: function (userData,caffeine) {
    		if (userData.caffeineCurrent>640) {
    			alert("Alert! Too much caffeine already in your system! Drink water!");
    			return;
    		}
    		const confirmDrink = confirm(userData.userName+" will get "+caffeine+" mg of caffeine");
			if (confirmDrink == true) {
	    		axios.post("api/drink/add",{'userName':userData.userName,'caffeine':caffeine}).then(response => {
		            this.state = response.data;
				});
    		}
    	}
    },
	beforeMount() {
		this.getState();
	}
  });
}

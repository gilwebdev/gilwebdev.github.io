// Initialize Firebase
const configFb = {
	apiKey: "AIzaSyA7NF7dr0Pe9y_7wa9lYnf9J6DMbLyW89g",
	authDomain: "mygame-cffb3.firebaseapp.com",
	databaseURL: "https://mygame-cffb3-default-rtdb.firebaseio.com",
	projectId: "mygame-cffb3",
	storageBucket: "mygame-cffb3.appspot.com",
	messagingSenderId: "640457185739",
	appId: "1:640457185739:web:1a59b489c88a989b707e4e"
};
firebase.initializeApp(configFb);

var databaseFb = firebase.database();
var dbLength = 0;
var idPlayer;
var existPlayer = false;
var playerLogged = false;
var dataPlayer;

var consultFb = databaseFb.ref('ranking').on('value', function (snapshot) {
	dbLength = snapshot.val().length;
	// Ranking
	var players = [];
	var players_ = snapshot.val();
	Object.keys(players_).forEach(function (key) {
		var p = {
			nome: players_[key].nome,
			score: players_[key].score,
		};
		players.push(p);
	});
	players.sort(sortByScore);
	document.getElementById('score-1').innerHTML = "#1 SCORE: <b>" + players[0].score + "</b> - " + players[0].nome;
	document.getElementById('score-2').innerHTML = "#2 SCORE: <b>" + players[1].score + "</b> - " + players[1].nome;
	document.getElementById('score-3').innerHTML = "#3 SCORE: <b>" + players[2].score + "</b> - " + players[2].nome;
});

function sortByScore(a, b) {
	var aScore = a.score;
	var bScore = b.score;
	return ((aScore > bScore) ? -1 : ((aScore < bScore) ? 1 : 0));
}

function isLogged() {
	if (localStorage.getItem("playername")) {
		var p = JSON.parse(localStorage.getItem("playername")).nome;
		var p_s = JSON.parse(localStorage.getItem("playername")).score;
		idPlayer = JSON.parse(localStorage.getItem("playername")).id;
		if (p != "") {
			dataPlayer = JSON.parse(localStorage.getItem("playername"));
			playerLogged = true;
			$("#player").html(p + " - BEST SCORE: <b>" + p_s + "</b>");
			$("#aviso").hide();
			$("#player").show();
			$(".btn-login").hide();
			$(".btn-logout").show();
			$(".acoes p").css({ "margin": "5px 5px 5px auto" });
		}
	}
}

setTimeout(function () {
	isLogged();
}, 500);

function entrarFb() {
	var Email = document.getElementById("formCad").elements.namedItem("email").value;
	var Nome = document.getElementById("formCad").elements.namedItem("nome").value;
	var players = [];

	// Player Exist ?
	var consultFb = databaseFb.ref('ranking').once('value').then(function (snapshot) {

		var players_ = snapshot.val();
		Object.keys(players_).forEach(function (key) {
			var p = {
				nome: players_[key].nome,
				email: players_[key].email,
				score: players_[key].score,
			};
			players.push(p);
		});

		for (var i = 0; i < players.length; i++) {
			// Player Fb
			if (players[i].email === Email) {
				idPlayer = i;
				localStorage.setItem("playername", JSON.stringify({ 'id': idPlayer, 'nome': players[i].nome, 'email': Email, 'score': players[i].score }));
				document.getElementById("player").innerHTML = JSON.parse(localStorage.getItem("playername")).nome + " - BEST SCORE: <b>" + players[i].score + "</b>";
				dataPlayer = { id: idPlayer, nome: players[i].nome, email: players[i].email, score: players[i].score };
				existPlayer = true;
				playerLogged = true;
			}
			if (i === players.length - 1) {
				if (existPlayer === false) {
					// Novo Player
					var no = { nome: Nome, email: Email, score: 0 };
					var update = databaseFb.ref('ranking').child(dbLength).update(no);
					idPlayer = dbLength - 1;
					localStorage.setItem("playername", JSON.stringify({ 'id': idPlayer, 'nome': Nome, 'email': Email, 'score': 0 }));
					document.getElementById("player").innerHTML = JSON.parse(localStorage.getItem("playername")).nome;
					dataPlayer = { id: idPlayer, nome: Nome, email: Email, score: 0 };
					playerLogged = true;
				}
			}
		}

		$("#aviso").hide();
		$("#player").show();
		$(".btn-login").hide();
		$(".btn-logout").show();
		$("#myModal").modal('hide');
		$(".acoes p").css({ "margin": "5px 5px 5px auto" });

	});
}

function sairFb() {
	localStorage.removeItem("playername");
	playerLogged = false;
	$("#aviso").show();
	$("#player").hide();
	$(".btn-login").show();
	$(".btn-logout").hide();
}

function registraScore(score) {
	if (playerLogged) {
		if (score > dataPlayer.score) {
			var update = databaseFb.ref('ranking').child(dataPlayer.id).update({ score: score });
			console.log("Registrando Score: " + score);
			// Update localStorage
			var no = { 'id': dataPlayer.id, 'nome': dataPlayer.nome, 'email': dataPlayer.email, 'score': score };
			localStorage.setItem("playername", JSON.stringify(no));
		}
	} else { console.log("Usuário não logado."); }
}

function Login(){
	var self = this;
	var isLoggedIn = false;
	
	self.userIsLogged = function(){
		return isLoggedIn;
	}
	
	self.logUserIn = function(user, pass){
		var data = {user:user, pass:pass}
		
		$.post(api('login', 'logUser'), data, function(result){
			if(result.success == true)
				showIniPage();
			else showErrorMessage();
		});
	}
	
	function showErrorMessage(result){
		$('p#errorDisplay').html('Erro no Login. Por gentileza verifique seus dados de acesso e tente novamente.');
	}	
	 
	function showIniPage(result){
		console.log('../home.html');
	}
}
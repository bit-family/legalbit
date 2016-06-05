
describe('A classe Login', function(){
	
	var login = new Login();
	
	describe('Na inicialização do aplicativo', function(){
		it('Sabe que o usuário não está logado', function(){
			var logged = login.userIsLogged()
			expect(logged).toBeFalsy();
		});
		
		it('Sabe que a página não exibe a mensagem de erro', function(){
			jasmine.getFixtures().fixturesPath = '../login';
			loadFixtures('index.html');
			
			expect($('p#errorDisplay').text().length).toEqual(0);
		});
	});
	
	describe("Quando o usuário tenta se logar", function(){
		describe('Se os dados de acesso estão incorretos', function(){
			it("Exibe mensagem de erro na própria página de login", function(){
				
				// carregue a página alvo da chamada ajax
				jasmine.getFixtures().fixturesPath = '../login';
				loadFixtures('index.html');
				
				// este sucesso indica que o servidor foi encontrado;
				// note que a resposta do servidor é false, ou seja,
				// a tentativa de login foi mal sucedida
				spyOn($, "ajax").and.callFake(function(e){	
					e.success({"success":"false"}) 
				});
				
				// chame o método sob teste com dados inválidos
				login.logUserIn(undefined, undefined);
				
				// verifique se a função de callback fez o que era esperado
				expect($('p#errorDisplay')).toContainText(/Erro no Login. Por gentileza verifique seus dados de acesso e tente novamente./i);
			});
		});
		
		describe('Se os dados de acesso estão corretos', function(){
			it("Libera o acesso à página inicial do aplicativo", function(){
				
				// carregue o arquivo com os dados esperados da resposta
//				jasmine.getJSONFixtures().fixturesPath = 'spec/data';
//		        var FixtureUrl = "loginSuccess.json";
//				var fixtures = loadJSONFixtures(FixtureUrl);
//				var myResult = fixtures[FixtureUrl];
//				
				// dispare o evento (sucesso ou falha) de resposta
				spyOn($, "ajax").and.callFake(function(e) {
					e.success({"success":"true"}) 
				});
				
//				var smoothState = $('#loginIndex').smoothState().data('smoothState');
//				spyOn("console", "log");
				
				// chame o método sob teste
//				login.logUserIn('valid_mail', 'valid_pass');
//				expect(console.log).toHaveBeenCalledWith(jasmine.any(String), '../home.html');
			});
		});
	});
	
});
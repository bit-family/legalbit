
describe("jQuery",function(){
	describe("Ajax Calls:", function(){
		describe("with $.ajax", function(){
			
			var configurationData = {
				url: "arq.json",
				remainingTime: 5000
			};
			
			// Scenario 1
			it("Correct URL should be passed to $.ajax object", function(){
				spyOn($, "ajax");
				sendRequestWithJQuery(undefined, undefined,	configurationData);
				expect($.ajax).toHaveBeenCalledWith(jasmine.
				objectContaining({url: configurationData.url}));
			});
			
			
			// Scenario 2
			it("Method 'myCallback' should be called on successful response", function(){
				spyOn($, "ajax").and.callFake(function(e) {	e.success({}) });
				
				// crie um apontador para a função de callback esperada
				var back = jasmine.createSpy();
				
				// chame o método/função sob teste
				sendRequestWithJQuery(back, undefined, configurationData);
				
				// verifique se a função esperada foi, realmente, chamada
				expect(back).toHaveBeenCalled();
			});			
			
			// Scenario 3
			it("Error method showErrorMessage should be called for any	malfunctioning", function(){
				spyOn($, "ajax").and.callFake(function(e) {	e.error({})	});
				
				// crie um apontador para a função de callback esperada
				var showErrorMessage = jasmine.createSpy();
				
				// chame o método/função sob teste
				sendRequestWithJQuery(undefined, showErrorMessage, configurationData);
				
				// verifique se a função esperada foi, realmente, chamada
				expect(showErrorMessage).toHaveBeenCalled();
			});
			
			//Scenario 4
			xdescribe("DOM Manipulation", function(){
				it("Test HTML Fixture", function(){
					
					// carregue a página alvo da chamada ajax
					jasmine.getFixtures().fixturesPath = 'spec/fixtures';
					loadFixtures('myfixture.html');
					
					// carregue o arquivo com os dados esperados da resposta
					jasmine.getJSONFixtures().fixturesPath = 'spec/fixtures';
					var FixtureUrl = "myJSONData.json";
					var fixtures = loadJSONFixtures(FixtureUrl);
					var myResult = fixtures[FixtureUrl];
					
					// dispare o evento (sucesso ou falha) de resposta
					spyOn($, "ajax").and.callFake(function(e) {
						e.success(myResult);
					});
					
					// chame o método sob teste
					sendRequestWithJQuery(myCallback, undefined, configurationData);
					
					// verifique se a função de callback fez o que era esperado
					expect($('#my-fixture')).toContainText(/Jasmine Cookbook by Munish Sethi/i);
				});
			});
			
			
		});
	});
});
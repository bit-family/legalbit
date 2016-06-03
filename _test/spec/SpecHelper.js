
function flushDatabase(bd, verbose){
	verbose = typeof verbose == 'undefined' ? false : verbose;
	var title  = verbose ? 'Fim do teste - ' + CamelCase(bd) : '';
	var local  = verbose ? 'A tabela '+bd+' do bd local está vazia' : '';
	var remote = verbose ? 'A tabela '+bd+' do bd remoto está vazia' : '';
	
	describe(title, function(){
		var resp = null;
		
		describe('', function(){
			beforeEach(function(done){
				$.post(api(bd, 'reset_for_js_test'),{}, function(data){
					resp = data;
					done();
				});
			});
			
			it(remote, function(){
				expect(resp).toBeTruthy();
			});
		});	
		
		describe('', function(){
			beforeEach(function(done){
				dati.emptyTable(prefix+bd, function(data){
					resp = data;
					done();
				});
			});
			
			it(local, function(){
				expect(resp).toBeTruthy();
			});
		});
	});
}
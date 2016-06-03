/**
 *  
 */
describe('Pré-requisito do teste - Chat', function(){
	var resp = null;

	describe('', function(){
		beforeEach(function(done){
			Usuario.create({'nome':'User1', 'snome':'Test1', 'email':'test-1@mail.com', 'id_unidade':1});
			Usuario.create({'nome':'User2', 'snome':'Test2', 'email':'test-2@mail.com', 'id_unidade':2});
			Usuario.create({'nome':'User3', 'snome':'Test3', 'email':'test-3@mail.com', 'id_unidade':3});
			Usuario.create({'nome':'User4', 'snome':'Test4', 'email':'test-4@mail.com', 'id_unidade':4});
			
			Usuario.create({'nome':'User5', 'snome':'Test5', 'email':'test-5@mail.com', 'id_unidade':5}, 
				function(){done()}
			);
			
		});
		
		it('A tabela usuario do bd remoto deve ter 5 usuários cadastrados', function(done){
			$.get(api('usuario', 'get_all'), function(user_list){
				expect(user_list.length).toEqual(5);
				done();
			});
		});
	});	

});


describe('A classe Chat', function(){
	var n = 0;
	
	dati.connect(function(){
		dati.addSchema(Chat.schema(prefix));				
	});

	describe('', function(){	
		var tableCreated = false;
		beforeEach(function(done){
			dati.createTables(function(data){
				tableCreated = data;
				done();
			});
		});		
		
		it('', function(){
			expect(tableCreated).toBeTruthy();
		});
	});
	

	describe(++n +'. Envia mensagens do aplicativo para o servidor.', function(){		
		var resp = null;
		var msg = null;

		msg1 = {from_id:1, to_id:2, content:'some important message', last_modified:'2016-01-11 00:00:00'};
		msg2 = {from_id:1, to_id:3, content:'some important message', last_modified:'2016-10-10 00:00:00'};
		msg3 = {from_id:1, to_id:4, content:'some important message', last_modified:'2016-01-11 00:00:00'};
		msg4 = {from_id:1, to_id:5, content:'some important message', last_modified:'2016-02-10 00:00:00'};
		msg5 = {from_id:1, to_id:2, content:'some important message', last_modified:'2016-01-10 00:00:00'};
		msg6 = {from_id:1, to_id:2, content:'some important message', last_modified:'2016-01-12 00:00:00'};
		msg = [msg1, msg2, msg3, msg4, msg5, msg6]; var k = 1; var i = 0;

		beforeEach(function(done){					
			Chat.postMessage(msg[i++], function(data){
				resp = data;
				done();
			});
		});

		it(n+'.'+ k++ + ' Mensagem do usuário 1 ao usuário 2', function(){
			expect(resp[0].partner_id).toBe('2'); 
		});		

		it(n+'.'+ k++ + ' Mensagem do usuário 1  ao usuário 3', function(){
			expect(resp[0].partner_id).toBe('3');
		});

		it(n+'.'+ k++ + ' Mensagem do usuário 1  ao usuário 4', function(){
			expect(resp[0].partner_id).toBe('4'); 
		});		

		it(n+'.'+ k++ + ' Mensagem do usuário 1  ao usuário 5', function(){
			expect(resp[0].partner_id).toBe('5');
		});

		it(n+'.'+ k++ + ' Mensagem do usuário 1  ao usuário 2', function(){
			expect(resp[0].partner_id).toBe('2'); 
		});		

		it(n+'.'+ k++ + ' Mensagem do usuário 1  ao usuário 2', function(){
			expect(resp[0].partner_id).toBe('2');
		});
	});
		
});

flushDatabase('chat');
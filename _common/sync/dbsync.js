/**
 * Classe que sincroniza tabelas do banco de dados local 
 * com tabelas de um banco de dados remoto. Para o uso desta classe, é necessário
 * definir em um arquivo de configuração o valor da constante 'script_url'. Caso 
 * este valor não esteja definido a classe, automaticamente, atribui 'localhost' 
 * como endereço do script.
 */

function DBSync(){}


DBSync.prototype.schema = function(prefix){
	return {"table":prefix+"dbsync",
            "fields": [
                {"name":"id", "type":"INTEGER", "size":11, "key":true},
				{"name":"table_name", "type":"VARCHAR", "size":30, "key":"UNIQUE"},
				{"name":"last_remote_table_update", "type":"VARCHAR", "size":20, "default":'2015-01-01 00:00:00', "key":false}
            ]
	}
}


DBSync.prototype.insert = function(data, prefix){
	for(i = 0; i < data.length; i++){
		var syncrow = {"table_name":data[i].table_name, "last_remote_table_update":data[i].last_remote_table_update};
		dati.insert(prefix+'dbsync', syncrow, function(last_inserted_id){});
	}
}


/**
 * 
 * @param String table: nome da tabela a ser sincronizada
 * @param String prefix: prefixo do condomínio
 * @param String callback
 */
DBSync.downSyncronize = function(table, prefix, processCallback, finishCallback){
	dati.maxLastModified(prefix+table, null, function(max){		
		$.post(api('changes', 'get_itens'), {'table_name':table, 'last_modified':max}, 
			function(data, status, xhr){	
				if(data < 1) return;
				
				var className = CamelCase(table);			
				for(var i = 1; i < data.length; i++){
					if(typeof data[i] != 'undefined'){
						processCallback(data[i]);
						window[className].insert(data[i], prefix);
					}
				}
	
				var last_table_update = data[0].last_table_update;
				localStorage.setItem(prefix+table+'_last_remote_table_update', data[0].last_table_update);	
				var sql = "UPDATE "+prefix+"dbsync SET last_remote_table_update='"+last_table_update+
				          "' WHERE table_name LIKE '"+table+"'";
				dati.query(sql, function(){});
				finishCallback();	
			}
		)
	})
}


DBSync.downSync = function(table, callback){
	var network = navigator.network.connection.type;
	if(network == Connection.NONE){
		callback(-1); return;
	}
	
	dati.maxLastModified(prefix+table, null, request_update);		
	function request_update(last_time){
		var update_data = {'table_name':table, 'last_modified':last_time};
		$.post(api('changes', 'update_table'), update_data, function(data,s,x){	
			if(data.length){
				if(typeof data.error != 'undefined') {
					callback(-1);
					return;		
				}
				window[CamelCase(table)].insert(data, prefix);				
				callback(data,s,x);	
			}
			else callback(0);
		});
	}
}

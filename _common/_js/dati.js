
/*s1 = schemaVeiculo();
//s2 = schemaEvento();
s3 = schemaEspaco();
s4 = schemaRegra();
s5 = schemaDetalheRegra();
s6 = schemaUser();
s7 = schemaLivro();
s8 = schemaPublicidade();*/


window.dati =  {
    
    /* Variaveis do BD do sistema */
	db: null,
    DB_NAME: "Localbit",
    DB_VERSION: "1.0",
    DB_DESCRIPTION: "Localbit App Database - The base of success.",
    DB_SIZE: 2*1024*1024,
	DB_TABLES: [],
	DB_NUM_TABLES: 0,
	
	addSchema: function(schema){
		this.DB_TABLES.push(schema);
	},
	
	resetSchema: function(){
		this.DB_TABLES = [];
	},
    
    /**  Funções de conexão ao banco de dados local **/
    initialize: function(callback){
        dati.connect(callback); 
		// some extra configs...
    },
	
    connect: function(callback) {
        var self = this;
        this.db = window.openDatabase(self.DB_NAME, self.DB_VERSION, self.DB_DESCRIPTION, self.DB_SIZE);		
		if(this.db != null){
			callback(true);
		}					
    },
	
	loaded: function(){
		return dati.db != null;
	},
	
    /**  FIM das funções de conexão ao banco de dados local **/
    
    /**  Funções de estrutura do banco de dados local **/
    createTables: function(callback) {
        var self = this;
        this.db.transaction(
            function(tx) {
                /**
                 * Estruturar tabelas no bd...
                 */
                $.each(self.DB_TABLES,function(i, t){
                    
                    var table = t["table"];
                    var sql = "CREATE TABLE IF NOT EXISTS "+table+" ( ";
                    
                    // Campos da tabela...
                    $.each(t["fields"], function(j, field){
                        
                        // Nome do campo...
                        var fName = field["name"];
                        
                        // Tipo do campo...
                        var fType = field["type"].toUpperCase();
                        
                        // Validar tamanho e chave (tipo inteiro)..
                        if(fType!="INTEGER" && fType!="FLOAT" && fType!="REAL" && fType!="NUMBER"){
                            fType += "("+field["size"]+")";
                        }
                        
                        // Validar chave...
                        log('key: '+field["key"]);
                        if(fType=="INTEGER" && field["key"] == true){
                            var fKey = "PRIMARY KEY AUTOINCREMENT";
                        }
                        else if(field["key"] == false){
                            var fKey = "";
                        }
                        else if(field["key"] == 'UNIQUE'){
                        	var fKey = "NOT NULL UNIQUE";
                        }                         
                        else if(field["key"].substr(0,5) == 'CHECK'){
                        	var fKey = field["key"];
                        } 
                        
                        
                        // Validar valor padrao...
                        var fDefault = field["default"];
                        if(fDefault!=null){
                            if(fType!="INTEGER" && fType!="FLOAT" && fType!="REAL" && fType!="NUMBER"){
                                fDefault = "'"+fDefault+"'";
                            }
                            fDefault = "DEFAULT "+fDefault;
                        }else{
                            fDefault = "";
                        }
                        
                        // Montar SQL para criação do campo...
                        sql += fName+" "+fType;
                        if(fDefault.length>0) sql += " "+fDefault;
                        if(fKey.length>0) sql += " "+fKey;
                        
                        // Validar separador de campo...
                        if(j<t["fields"].length-1){
                            sql += ", ";
                        }
                        
                    });
                    
                    sql += " );";
                    // Montando a tabela... 
                    log('sql: ' + sql);
                    tx.executeSql(sql);
                    log(sql);
                });
                
            },
            function(tx){
                log('Error on update: '+tx.message);
                callback(false);                    
            },
            function() {
                log('Tables successfully CREATED in local SQLite database');
                callback(true);
            }
        );
    },
	
    resetDatabase: function(callback) {
        var self = this;
        this.db.transaction(
            function(tx) {
                $.each(self.DB_TABLES, function(i, t){                    
                    var sql = 'DROP TABLE IF EXISTS '+t["table"];
                    tx.executeSql(sql);
                });
            },
            function(tx){
                log('Error on update: '+tx.message);
                callback(false);                    
            },
            function() {
                log('Tables successfully DROPPED in local SQLite database');
                callback(true);
            }
        );
    },
	
    emptyTable: function(table, callback) {
        this.db.transaction(
            function(tx) {
                tx.executeSql("DELETE FROM "+table);
				tx.executeSql("UPDATE sqlite_sequence SET seq=0 WHERE name='"+table+"'");
            },
            function(tx){
                log('Error on empty table: '+tx.message);
                callback(false);                    
            },
            function() {
                log('Table '+table+' successfully EMPTED in local SQLite database');
                callback(true);
            }
        );
    },
	
    dropTable: function(table, callback) {
        this.db.transaction(
            function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS '+table);
            },
            function(tx){
                log('Error on drop table: '+tx.message);
                callback(false);                    
            },
            function() {
                log('Table '+table+' successfully DROPPED in local SQLite database');
                callback(true);
            }
        );
    },
    /**  FIM das funções de estrutura do banco de dados local **/
    
    /**  Funções de manipulação do banco de dados local **/        
    query: function(sql, callback) {
        this.db.transaction( function(tx) {
        	log(sql);
            tx.executeSql(sql, [], function (tx, result) {
                log('Query "'+sql+'" returned '+result.rows.length + ' rows.');
                callback(result);
            });
        },
        function(tx){
            log('Error on query: '+tx.message);               
        },
        function() {
            log('dati.query returned successfully.');
        });
    },
    
    // This works as long as all values you explicitly pass in are truthy. 
    // Values that are not truthy: null, undefined, 0, false, '' and NaN
    // Em JavaScript , um valor truthy é um valor que se traduz em verdadeiro 
    // quando avaliado em um contexto Booleano
    maxLastModified: function(table, cond, callback){
    	var where = cond ? ' WHERE ' + cond : '';       	
    	var sql = 'SELECT MAX(last_modified) AS max FROM '+table+where;
    	this.query(sql, function(res){	
    		var max = res.rows.item(0).max != null ? 
    				  res.rows.item(0).max : '2016-04-01 00:00:00';
    		callback(max);
    	})
    }, 
    
    resultAsArray: function(results){
    	var registers = [];
    	for (var i = 0; i < results.rows.length; i++) {
            registers[i] = results.rows.item(i);
        }
    	return registers;
    },
	
    // retorna um vetor do js
    selectAll: function(table, callback) {
        this.db.transaction( function(tx) {
            var sql = "SELECT * FROM "+table+ " WHERE  deleted = 0";
            tx.executeSql(sql, [], function (tx, results) {
                callback(dati.resultAsArray(results));
            });
        },
        function(tx){
        	callback(null);
        	log('Error on selectAll: '+tx.message);               
        },
        function() {
        	log('dati.SelectAll returned successfully.');
        });
    },
	
	verify: function(table, size, callback){
		this.db.transaction( function(tx) {
			tx.executeSql('SELECT COUNT(*) as val' + table, [], function (tx, res) {
				callback(res.rows.item(0).val);
			});
		});
	},
	
	countTables: function(callback){
		this.db.transaction( function(tx) {
			sql = "SELECT COUNT(*) as val FROM sqlite_master WHERE type = 'table'";
			tx.executeSql(sql, [], function(tx, res){
				this.DB_NUM_TABLES = res.rows.item(0).val;
				callback(res.rows.item(0).val);				
			});
		});
	},
	
    insert: function(table, jsonRegister, callback){
	    var self = this;
        this.db.transaction(function(tx) {
            var columns = [];
            var values = [];
            var params = [];

            // Percorrer valores do pacote JSON referente aos campos
            $.each(jsonRegister, function(key, value) {
                columns.push(key);
                values.push("?");
                params.push(String(value));
            });            
            
            var sql = 'INSERT OR REPLACE INTO '+table+' ('+columns+') VALUES ('+values+')';
//            console.log(sql + ' - ' + params);
            tx.executeSql(sql, params, function(tx, results) {
                var id = results.insertId;
                log('New record inserted in table "'+table+'". Key generated is '+id+'');
                callback(id);
            },
            
            function(tx){
            	console.log('Error on insert: '+tx.message);
                callback(false);                    
            });
	    });
    },
	
    update: function(table, jsonFields, key, value, callback){
        var self = this;
        this.db.transaction(function(tx, results) {
                
            var values = "";
            var params = [];

            try{
              var fields = $.parseJSON(jsonFields);
            }catch(err){
              var fields = jsonFields;
            }

            // Percorrer valores do pacote JSON referente aos campos
            $.each(fields, function(k, v) {
                if (values=="") {
                    values = k+"=?";
                }else{
                    values = values + ", "+k+"=?";
                }
                params.push(String(v));
            });

            var sql = 'UPDATE '+table+' SET '+values+' WHERE '+key+' = '+value;
            log(sql);
            tx.executeSql(sql,params, 
                function(tx, results) {
                
                    log('Update record '+key+' = '+value+' from table "'+table+'" | Params: '+JSON.stringify(params));
                    callback(true);
                
                },
                function(tx){
                    log('Error on update: '+tx.message);
                    callback(false);                    
                }
            );
            
        });
    },
	
    remove: function(table, key, value, callback){
        this.db.transaction(function(tx, results) {
            var sql = 'DELETE FROM '+table+' WHERE '+key+' = ?';
            tx.executeSql(sql,[value],
                function(tx, results) {
                    log("Removed record from table "+table+", where "+key+" = "+value);
                    callback(true);
                },
                function(tx){
                    log('Error on delete: '+tx.message);
                    callback(false);                    
                }
            );
	    });
    }, 
    /**  FIM das funções de manipulação do banco de dados local **/      
    
};

function log(msg) {
//	console.log(msg);
}
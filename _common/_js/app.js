
localStorage.advcode = 'drelio';

var server_url = 'http://legalbit.com.br/';

function api(ctrl, func){
	return server_url+localStorage.advcode+'/api/' + ctrl + '/'+ func;
}
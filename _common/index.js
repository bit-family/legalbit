
var smoothState = $('#main').smoothState().data('smoothState');

// neste arquivo devemos carregar as seguintes páginas:
// cadastro, no primeiro acesso do usuário
// smoothState.load('login/signup.html');

// login para o usuário acessar com senha
smoothState.load('login/index.html');

// home caso o usuário dispense o uso de senha
// smoothState.load('home.html');


/*
 * Naturalmente, a condições para o carregamento condicional  
 * de páginas ainda precisam ser definidas e programadas.
 */
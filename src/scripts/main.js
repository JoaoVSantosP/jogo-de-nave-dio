// função para iniciar o jogo
function start() {

    $("#inicio").hide();
    // a partir do momento que start é iniciada, a janela "inicio" é escondida
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    // Divs froam declaradas dentro da #fundoGame
    
    var jogo = {}
    var TECLA = { Q: 81, S: 83, K: 75 }
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var fimdejogo = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");
    
    jogo.timer = setInterval(loop,33.3); // deixando o fundo do jogo em loop a cada 33.3ms, ou seja, cerca de 30 frames por segundo
    jogo.pressionou = [];
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    // verificar se alguma tecla foi pressionada
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
        
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
    
    // função de looping que vai trabalhar de acordo com os frames por segundo
    function loop() {
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
    }
    
    function moveFundo() {
        esq = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esq-1);
    }
    //função que vai movimentar o funto do jogo para a esquerda

    // função para mover o jogador
    // para cima
    function moveJogador() {
        if (jogo.pressionou[TECLA.Q]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo - 10);

            // limitando o helicóptero no topo da página
            if (topo<=0) {
                $("#jogador").css("top",topo + 10);
            }
        }

        //para baixo
        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo + 10);

            // limitando o helicóptero no final da página
            if (topo>=434) {	
                $("#jogador").css("top",topo - 10);		
            }
        }
        
        //atirar
        if (jogo.pressionou[TECLA.K]) {
            disparo(); 
        }
    }

    // função para mover o helicóptero amarelo (inimigo1)
    function moveInimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX - velocidade);
        $("#inimigo1").css("top",posicaoY);
            
        if (posicaoX<=0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);           
        }
    }

    // função para mover o caminhao (inimigo2)
    function moveInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
	    $("#inimigo2").css("left",posicaoX - 3);
				
		if (posicaoX<=0) {
            $("#inimigo2").css("left",775);		
		}
    }

    // função para mover o amigo
    function moveAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX + 1);

        if (posicaoX > 906) {
            $("#amigo").css("left",0);
        }
    }

    // função que faz o jogador disparar
    function disparo() {
        if (podeAtirar == true) {
            somDisparo.play();
            podeAtirar = false;
            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 33.3);
        }
        
        // função que realiza o disparo da arma
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX + 15);  // percurso do disparo
            
            if (posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
            // enquando a div do tiro estiver na tela, não é possível atirar de novo
        }
    }

    // função que verifica a colisão dos itens do jogo
    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        // colisão do jogador com o inimigo1
        if (colisao1.length > 0) {
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        // colisão do jogador (helicóptero) com o inimigo2
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);

            $("#inimigo2").remove();
            reposicionaInimigo2();
        }

        // acertando o tiro no inimigo1
        if (colisao3.length > 0) {
            velocidade = velocidade + 0.3; // aumenta a velocidade do inimigo1 conforme vai acertando os tiros
            pontos = pontos + 100;
	        inimigo1X = parseInt($("#inimigo1").css("left"));
	        inimigo1Y = parseInt($("#inimigo1").css("top"));		
            explosao1(inimigo1X,inimigo1Y);
        
	        $("#disparo").css("left",950);
	        posicaoY = parseInt(Math.random() * 334);
	        $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        // acertando o tiro no inimigo2
	    if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            reposicionaInimigo2();
        }

        // ao encostar no amigo, pontua e regenera vida
	    if (colisao5.length > 0) {
            salvos++;
            pontos = pontos + 250
            energiaRegen();
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        }

        // colisão do amigo com o inimigo 2
        if (colisao6.length > 0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
        }
    }

    //função para regenerar vida
    function energiaRegen() {
        if (energiaAtual < 3)
        energiaAtual++        
    }

    // função da explosão, colisão com o inimigo1
    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(./src/assets/images/explosao.png)");

        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width: 200, opacity: 0}, "slow");
        
        var tempoExplosao = window.setInterval(removeExplosao, 1000);
        
        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }

    // função que reposiciona inimigo2
	function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {
                $("#fundoGame").append("<div id=inimigo2></div");
            }
        }	
    }

    // função da explosão, colisão com o inimigo2
	function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(./src/assets/images/explosao.png)");

        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width: 200, opacity: 0}, "slow");
        
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
        
        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    // função que reposiciona o amigo
	function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            
            if (fimdejogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }

    // função da explosão, colisão do amigo com inimigo2
    function explosao3(amigoX,amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);

        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }    

    // soma da pontuação do jogo
    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    // função para mostrar a vida atual do jogador
    function energia() {
        if (energiaAtual == 3) {
            $("#energia").css("background-image", "url(./src/assets/images/energia3.png)");
        }

        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(./src/assets/images/energia2.png)");
        }

        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(./src/assets/images/energia1.png)");
        }

        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(./src/assets/images/energia0.png)");
            gameOver(); // chamando a função game over
        }
    }

    // fim de jogo
	function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();
        window.clearInterval(jogo.timer);
        jogo.timer = null; //parando o tempo do jogo
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    } // por fim, remove todos os elementos do jogo e abre um outro elemento perguntando se vai jogar novamente

}

// função que reinicia o jogo 
function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}
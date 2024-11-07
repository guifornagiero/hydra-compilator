# hydra-compilator
Compilador para a linguagem de programação Hydra, criada para a disciplina de Compiladores da FEI

# Como executar o compilador?
1.	Clone o repositório @guifornagiero/hydra-compilator do GitHub <br>
2.	Instale o node no seu computador (neste projeto utilizamos o node 20.15.0) <br>
3.	Instale o Java no seu computador (neste projeto utilizamos o JDK 21). <br>
4.	Ao abrir a pasta root do projeto, execute o comando npm install para instalar as dependências <br>
5.	No arquivo code.hydra, insira o código que deseja que seja compilado <br>
6.	Para executar o compilador, utilize o comando npm run compile <br>
7.	Assim, o compilador automaticamente converterá o código hydra para Java, compilará o código Java e executará (ele executará a sequência: javac output/Main.java – cd output – java Main – cd ..). <br>
8.	Você poderá consultar a saída no terminal. <br><br>

# Como programar em Hydra?
## Variáveis
var <int> id -> 10;
var <string> id -> "Hello";
var <dec> id -> 3.14;
var <bool> id -> true;

## Condições (if, else if e else)
@i (id = 10) >-> {
  id -> 20;
} @ei (id = 30) >-> {
  id -> 40;
} @e >-> {
  id -> 50;
}

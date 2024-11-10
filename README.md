# hydra-compilator
Compilador para a linguagem de programação Hydra, criada para a disciplina de Compiladores da FEI.<br>
Prof. Charles Ferreira

## Grupo
GIANLUCA MARIANO SOBREIRO - 22.122.011-4<br>
GUILHERME FORNAGIERO DE CARVALHO - 22.122.016-3<br>
PAULO VINÍCIUS BESSA DE BRITO - 22.122.005-6<br>
PEDRO AUGUSTO BENTO ROCHA - 22.122.028-8<br>


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
## Begin e end
```
begin;

-- todo o código escrito --

end;
```

## Variáveis
```
-- comentários não serão compilados --
var <int> id -> 10;
var <string> id -> "Hello";
var <dec> id -> 3.14;
var <bool> id -> true;
```

## Condições (if, else if e else)
```
@i (id = 10 or id = 15) >-> { --if --
  id -> 20;
} @ei (id > 30 and id not 35) >-> { -- else if --
  id -> 40;
} @e >-> { -- else --
  id -> 50;
}
```

## Loopings (for e while)
```
-- while --
@w (true) >-> {
  @p("Hello world");
}

-- for --
@f (var <int> num -> 0 | from num to 10 | up num) >-> {
  @p(num);
}

@f (var <int> num -> 10 | from num to 0 | down num) >-> {
  @p(num);
}
```

## Inputs e Outputs
```
-- read --
var <int> num -> (int)@r();
var <string> name -> (string)@r();
var <dec> pi -> (dec)@r();
var <bool> flag -> (bool)@r();

-- print --
@p("Output");
@p(num);
@p(name);
@p(pi);
@p(flag);
```

## Jamal
```
-- só pode existir um jamal, antes do end; --
jamal;
```

